import { Client } from "@stomp/stompjs";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class WebSocketManager {
  constructor(url) {
    this.url = url;

    // bağlantı ve durum
    this.isConnected = false;
    this.isActive = true; // sayfa görünür + focus
    this.disableReconnect = false;

    // abonelikler
    this.subscriptions = new Map();

    // callback'ler
    this._onConnect = null;
    this._onDisconnect = null;
    this._onForceLogout = null;

    // ping timer
    this._pingIntervalId = null;

    // refresh lock (aynı anda tek refresh)
    this._refreshInFlight = null;

    // visibility/focus/blur handler referansları (destroy'da kaldırmak için)
    this._visibilityHandler = null;
    this._focusHandler = null;
    this._blurHandler = null;
    this._freezeHandler = null;
    this._visibilityBound = false;

    // foreground kick spam engeli
    this._lastForegroundKickAt = 0;

    this._t0 = performance.now();
    this._lastEventAt = this._t0;
    this._connAttempt = 0;

    this._tlog = (label, extra = {}) => {
      const now = performance.now();
      const sinceStart = (now - this._t0).toFixed(0);
      const sinceLast = (now - this._lastEventAt).toFixed(0);
      this._lastEventAt = now;

      console.log(
        `%c[WS-TL] +${sinceStart}ms (Δ${sinceLast}ms) #${this._connAttempt} ${label}`,
        "color:#9c27b0;font-weight:700",
        extra,
      );
    };

    this.client = new Client({
      brokerURL: this.url,

      // connect öncesi Authorization header ekler
      beforeConnect: () => {
        this._connAttempt++;
        this._tlog("beforeConnect()", {
          active: this.isActive,
          clientActive: this.client?.active,
          disableReconnect: this.disableReconnect,
          hasToken: !!sessionStorage.getItem("access_token"),
        });

        const token = sessionStorage.getItem("access_token");

        if (!token) {
          this.disableReconnect = true;
          this._tlog("beforeConnect() -> NO TOKEN, cancel");
          throw new Error("No access token, cancel websocket connect");
        }

        this.client.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };
      },

      // otomatik reconnect gecikmesi
      reconnectDelay: this.disableReconnect ? 0 : 3000,

      // stomp debug logları
      debug: (b) => {
        console.log("[STOMP DEBUG]" + b);
      },

      // bağlanınca: flag set + callback + yeniden subscribe
      onConnect: () => {
        this._tlog("onConnect() ENTER", {
          subs: this.subscriptions.size,
          active: this.isActive,
        });

        this.isConnected = true;
        if (this._onConnect) this._onConnect();

        let reSubbed = 0;

        for (const [dest, data] of this.subscriptions.entries()) {
          if (!data.stompSubscription) {
            data.stompSubscription = this.client.subscribe(dest, data.callback);
            reSubbed++;
          }
        }

        this._tlog("onConnect() resubscribe DONE", { reSubbed });

        // opsiyonel sync
        try {
          this._tlog("send(sync) -> start");
          this.send("sync", {});
          this._tlog("send(sync) -> queued");
        } catch (e) {
          this._tlog("send(sync) -> FAILED", { err: String(e) });
        }
      },

      // disconnect olunca callback
      onDisconnect: () => {
        this._tlog("onDisconnect()");

        this.isConnected = false;

        // stale reset
        for (const [, data] of this.subscriptions.entries()) {
          data.stompSubscription = null;
        }

        if (this._onDisconnect) this._onDisconnect();
      },

      // socket kapanınca: beklenmeyense refresh+reconnect dene
      onWebSocketClose: async (evt) => {
        this._tlog("onWebSocketClose()", {
          code: evt?.code,
          reason: evt?.reason,
          wasClean: evt?.wasClean,
          disableReconnect: this.disableReconnect,
          wasConnected: this.isConnected,
        });

        const wasConnected = this.isConnected;
        this.isConnected = false;

        // stale reset
        for (const [, data] of this.subscriptions.entries()) {
          data.stompSubscription = null;
        }

        if (this.disableReconnect) {
          this._tlog("close ignored (disableReconnect=true)");
          return;
        }

        if (evt?.wasClean && wasConnected) {
          this._tlog("close wasClean -> fire onDisconnect()");
          if (this._onDisconnect) this._onDisconnect();
          return;
        }

        this._tlog("tryRefreshAndReconnect() -> start");
        await this.tryRefreshAndReconnect();
        this._tlog("tryRefreshAndReconnect() -> done");
      },

      // socket error log
      onWebSocketError: (evt) => {
        this._tlog("onWebSocketError()", { evt });
        console.warn("[WS] socket error", evt);
      },

      // server STOMP ERROR frame'i gönderirse burada yakalanır
      onStompError: async (frame) => {
        let code = null;

        try {
          if (frame.body && frame.body.length > 0) {
            const parsed = JSON.parse(frame.body);
            if (parsed?.code) code = parsed.code;
          }
        } catch {}

        if (!code) code = frame.headers?.message || null;

        this._tlog("onStompError()", {
          code,
          headerMessage: frame.headers?.message,
          body: frame.body,
        });

        console.warn("[WS] STOMP ERROR", {
          code,
          headerMessage: frame.headers?.message,
          body: frame.body,
        });

        // token expired ise refresh dene
        if (code === "TOKEN_EXPIRED") {
          this.disableReconnect = true;
          this._tlog("TOKEN_EXPIRED -> deactivate()");
          await this.client.deactivate();

          this._tlog("TOKEN_EXPIRED -> tryRefreshAndReconnect()");
          await this.tryRefreshAndReconnect();

          this.disableReconnect = false;
          this._tlog("TOKEN_EXPIRED -> done");
          return;
        }

        // session/token invalid ise logout akışına gir
        if (code === "INVALID_SESSION" || code === "INVALID_TOKEN") {
          this.disableReconnect = true;
          this.isConnected = false;

          this._tlog("INVALID_* -> clearSubscriptions + deactivate + forceLogout");
          this._clearSubscriptions();

          try {
            await this.client.deactivate();
          } catch {}

          if (this._onForceLogout) this._onForceLogout();
          return;
        }
      },
    });
  }

  // Authorization header üretir
  _authHeaders() {
    const token = sessionStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // tüm subscription'ları iptal eder ve Map'i temizler
  _clearSubscriptions() {
    for (const [, data] of this.subscriptions.entries()) {
      try {
        data.stompSubscription?.unsubscribe();
      } catch {}
      data.stompSubscription = null;
    }
    this.subscriptions.clear();
  }

  // sayfa aktif mi? (sadece görünürlük)
  _updateActiveState() {
    this.isActive = !document.hidden;
  }

  // aktifse ping başlat, pasifse durdur
  _applyPingPolicy(pingIntervalMs) {
    if (this.isActive) this.startPing(pingIntervalMs);
    else this.stopPing();
  }

  _handleForeground(delayMs, pingIntervalMs) {
    this._updateActiveState();
    this._applyPingPolicy(pingIntervalMs);

    if (this.isActive && !this.disableReconnect) {
      this._foregroundKick(delayMs);
    }
  }

  async _restartConnection() {
    this._tlog("_restartConnection() -> deactivate start");
    try {
      await this.client.deactivate();
    } catch {}
    this._tlog("_restartConnection() -> activate");
    this.disableReconnect = false;
    this.client.activate();
  }

  onForceLogout(cb) {
    this._onForceLogout = cb;
  }

  connect(onConnectCallback) {
    this._onConnect = onConnectCallback;
    this._tlog("connect() -> activate()");
    this.client.activate();
  }

  onDisconnect(cb) {
    this._onDisconnect = cb;
  }

  disconnect() {
    this._tlog("disconnect() manual -> disableReconnect + clear + deactivate");
    this.disableReconnect = true;
    this._clearSubscriptions();
    this.isConnected = false;
    this.stopPing();
    this.client.deactivate();
  }

  subscribe(channel, callback) {
    const existing = this.subscriptions.get(channel);
    if (existing?.stompSubscription) {
      try {
        existing.stompSubscription.unsubscribe();
      } catch {}
    }

    const wrappedCallback = (msg) => {
      let parsed = null;
      try {
        parsed = JSON.parse(msg.body);
      } catch {
        return callback(msg);
      }

      if (
        parsed &&
        parsed.eventId &&
        Object.prototype.hasOwnProperty.call(parsed, "data")
      ) {
        const forwarded = Object.assign({}, msg, {
          body: JSON.stringify(parsed.data),
        });

        try {
          const res = callback(forwarded);
          Promise.resolve(res).finally(() => {
            try {
              this.send("ack", { eventId: parsed.eventId });
            } catch {}
          });
        } catch (e) {
          throw e;
        }
        return;
      }

      return callback(msg);
    };

    this.subscriptions.set(channel, {
      callback: wrappedCallback,
      stompSubscription: null,
    });

    if (this.isConnected) {
      const stompSub = this.client.subscribe(channel, wrappedCallback);
      this.subscriptions.get(channel).stompSubscription = stompSub;
      return stompSub;
    }

    return null;
  }

  unsubscribe(channel) {
    const data = this.subscriptions.get(channel);
    if (!data) return;

    try {
      data.stompSubscription?.unsubscribe();
    } catch (e) {
      console.warn("unsubscribe error:", e);
    }

    this.subscriptions.delete(channel);
  }

  send(destination, body) {
    if (!this.isConnected) return;

    this._tlog(`send(${destination})`, { body });

    this.client.publish({
      destination: "/app/" + destination,
      body: JSON.stringify(body),
      headers: this._authHeaders(),
    });
  }

  refreshToken() {
    this.disableReconnect = false;

    this._tlog("refreshToken() -> deactivate then activate");
    this.client.deactivate().then(() => {
      this.client.connectHeaders = {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      };
      this.client.activate();
    });
  }

  async reconnectCheck() {
    if (this.disableReconnect) return;

    if (!this.client.active) {
      this._tlog("reconnectCheck(): client not active -> activate()");
      this.client.activate();
      return;
    }

    if (!this.isConnected) return;

    try {
      this.send("ping", {});
    } catch {}
  }

  startPing(intervalMs) {
    if (this._pingIntervalId) return;

    this._tlog("startPing()", { intervalMs });

    this._pingIntervalId = setInterval(() => {
      if (!this.isConnected || !this.isActive) return;

      try {
        this.client.publish({
          destination: "/app/ping",
          body: "{}",
          headers: this._authHeaders(),
        });
      } catch {
        this.reconnectCheck();
      }
    }, intervalMs);
  }

  stopPing() {
    if (this._pingIntervalId) {
      this._tlog("stopPing()");
      clearInterval(this._pingIntervalId);
      this._pingIntervalId = null;
    }
  }

  _foregroundKick(delayMs) {
    const now = Date.now();
    if (now - this._lastForegroundKickAt < 800) return;
    this._lastForegroundKickAt = now;

    this._tlog("_foregroundKick() scheduled", { delayMs });

    setTimeout(() => {
      if (this.disableReconnect) return;

      this._tlog("_foregroundKick() fire -> reconnectCheck + ping");
      this.reconnectCheck();

      try {
        this.send("ping", {});
      } catch {}
    }, delayMs);
  }

  bindVisibilityReconnect(pingIntervalMs = 5000) {
    if (this._visibilityBound) return;
    this._visibilityBound = true;

    this._tlog("bindVisibilityReconnect()", { pingIntervalMs });

    this._updateActiveState();
    this._applyPingPolicy(pingIntervalMs);

    this._visibilityHandler = () => {
      this._tlog("event: visibilitychange", {
        hidden: document.hidden,
        hasFocus: document.hasFocus(),
      });
      this._handleForeground(300, pingIntervalMs);
    };

    this._focusHandler = () => {
      this._tlog("event: focus");
      this._handleForeground(200, pingIntervalMs);
    };

    this._blurHandler = () => {
      this._tlog("event: blur");
      this._updateActiveState();
      this._applyPingPolicy(pingIntervalMs);
    };

    document.addEventListener("visibilitychange", this._visibilityHandler);
    window.addEventListener("focus", this._focusHandler);
    window.addEventListener("blur", this._blurHandler);

    this._freezeHandler = () => {
      this._tlog("event: freeze");
      this.isActive = false;
      this._applyPingPolicy(pingIntervalMs);
    };

    document.addEventListener("freeze", this._freezeHandler);
  }

  destroy() {
    this._tlog("destroy()");

    this.disableReconnect = true;
    this.isConnected = false;

    this.stopPing();

    if (this._visibilityHandler) {
      document.removeEventListener("visibilitychange", this._visibilityHandler);
      this._visibilityHandler = null;
    }
    if (this._focusHandler) {
      window.removeEventListener("focus", this._focusHandler);
      this._focusHandler = null;
    }
    if (this._blurHandler) {
      window.removeEventListener("blur", this._blurHandler);
      this._blurHandler = null;
    }
    if (this._freezeHandler) {
      document.removeEventListener("freeze", this._freezeHandler);
      this._freezeHandler = null;
    }

    this._visibilityBound = false;

    this._clearSubscriptions();

    try {
      this.client.deactivate();
    } catch {}

    this._onConnect = null;
    this._onDisconnect = null;
    this._onForceLogout = null;
  }

  async tryRefreshAndReconnect() {
    if (this._refreshInFlight) {
      this._tlog("tryRefreshAndReconnect(): already in flight");
      return this._refreshInFlight;
    }

    this._refreshInFlight = (async () => {
      try {
        this._tlog("tryRefreshAndReconnect(): refresh start");

        const refreshToken = sessionStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        this._tlog("tryRefreshAndReconnect(): refresh ok", {
          status: res.status,
        });

        const { accessToken, refreshToken: newRefresh } = res.data.data;

        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("refresh_token", newRefresh);

        this._tlog("tryRefreshAndReconnect(): restartConnection start");
        await this._restartConnection();
        this._tlog("tryRefreshAndReconnect(): restartConnection done");
      } catch (e) {
        this._tlog("tryRefreshAndReconnect(): FAILED -> forceLogout", {
          err: String(e),
        });
        if (this._onForceLogout) this._onForceLogout();
      } finally {
        this._refreshInFlight = null;
      }
    })();

    return this._refreshInFlight;
  }
}
