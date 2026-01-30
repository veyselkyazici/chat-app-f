import { Client } from "@stomp/stompjs";

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

    this.client = new Client({
      brokerURL: this.url,

      // connect öncesi Authorization header ekler
      beforeConnect: () => {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
          this.disableReconnect = true;
          throw new Error("No access token, cancel websocket connect");
        }

        this.client.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };
      },

      // otomatik reconnect gecikmesi
      reconnectDelay: this.disableReconnect ? 0 : 3000,

      // stomp debug logları
      debug: () => {
        // console.log("[STOMP DEBUG]" + b);
      },

      // bağlanınca: flag set + callback + yeniden subscribe
      onConnect: () => {
        this.isConnected = true;
        if (this._onConnect) this._onConnect();

        for (const [dest, data] of this.subscriptions.entries()) {
          if (!data.stompSubscription) {
            data.stompSubscription = this.client.subscribe(dest, data.callback);
          }
        }
      },

      // disconnect olunca callback
      onDisconnect: () => {
        this.isConnected = false;
        if (this._onDisconnect) this._onDisconnect();
      },

      // socket kapanınca: beklenmeyense refresh+reconnect dene
      onWebSocketClose: async (evt) => {
        const wasConnected = this.isConnected;
        this.isConnected = false;

        if (this.disableReconnect) {
          console.log("[WS] close ignored (disableReconnect=true)", evt?.code);
          return;
        }

        if (evt?.wasClean && wasConnected) {
          if (this._onDisconnect) this._onDisconnect();
          return;
        }

        await this.tryRefreshAndReconnect();
      },

      // socket error log
      onWebSocketError: (evt) => {
        console.warn("[WS] socket error", evt);
      },

      // server STOMP ERROR frame'i gönderirse burada yakalanır
      onStompError: async (frame) => {
        let code = null;

        // body JSON ise code çıkar
        try {
          if (frame.body && frame.body.length > 0) {
            const parsed = JSON.parse(frame.body);
            if (parsed?.code) code = parsed.code;
          }
        } catch {}

        // body yoksa header message'e bak
        if (!code) code = frame.headers?.message || null;

        console.warn("[WS] STOMP ERROR", {
          code,
          headerMessage: frame.headers?.message,
          body: frame.body,
        });

        // token expired ise refresh dene
        if (code === "TOKEN_EXPIRED") {
          this.disableReconnect = true;
          await this.client.deactivate();

          await this.tryRefreshAndReconnect();

          this.disableReconnect = false;
          return;
        }

        // session/token invalid ise logout akışına gir
        if (code === "INVALID_SESSION" || code === "INVALID_TOKEN") {
          this.disableReconnect = true;
          this.isConnected = false;

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

  // sayfa aktif mi (görünür + focus)?
  _updateActiveState() {
    this.isActive = !document.hidden && document.hasFocus();
  }

  // aktifse ping başlat, pasifse durdur
  _applyPingPolicy(pingIntervalMs) {
    if (this.isActive) this.startPing(pingIntervalMs);
    else this.stopPing();
  }

  // foreground'a dönüşte state/ping/ping+sync kick akışını toplar
  _handleForeground(delayMs, pingIntervalMs) {
    this._updateActiveState();
    this._applyPingPolicy(pingIntervalMs);

    if (this.isActive && !this.disableReconnect) {
      this._foregroundKick(delayMs);
    }
  }

  // bağlantıyı güvenli şekilde restart eder
  async _restartConnection() {
    try {
      await this.client.deactivate();
    } catch {}
    this.disableReconnect = false;
    this.client.activate();
  }

  // token/session invalid olunca dışarıdan logout tetiklemek için callback set eder
  onForceLogout(cb) {
    this._onForceLogout = cb;
  }

  // WS bağlantısını başlatır (connect callback'i saklar)
  connect(onConnectCallback) {
    this._onConnect = onConnectCallback;
    this.client.activate();
  }

  // disconnect callback set eder
  onDisconnect(cb) {
    this._onDisconnect = cb;
  }

  // manuel disconnect: reconnect kapat + subs temizle + ping durdur + deactivate
  disconnect() {
    this.disableReconnect = true;
    this._clearSubscriptions();
    this.isConnected = false;
    this.stopPing();
    this.client.deactivate();
  }

  // bir channel'a subscribe olur; envelope (eventId+data) varsa unwrap + ack gönderir
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

  // subscription iptal eder
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

  // server'a mesaj gönderir ("/app/{destination}")
  send(destination, body) {
    if (!this.isConnected) return;

    this.client.publish({
      destination: "/app/" + destination,
      body: JSON.stringify(body),
      headers: this._authHeaders(),
    });
  }

  // eski davranış: token yenilenince WS'i kapatıp yeni header'la açar
  refreshToken() {
    this.disableReconnect = false;

    this.client.deactivate().then(() => {
      this.client.connectHeaders = {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      };
      this.client.activate();
    });
  }

  // bağlantı sağlığı kontrolü: aktif değilse aç, bağlıysa ping dene
  async reconnectCheck() {
    if (this.disableReconnect) return;

    if (!this.client.active) {
      this.client.activate();
      return;
    }

    if (!this.isConnected) return;

    try {
      this.send("ping", {});
    } catch {}
  }

  // ping timer başlatır (aktif değilsek ping atmaz)
  startPing(intervalMs) {
    if (this._pingIntervalId) return;

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

  // ping timer durdurur
  stopPing() {
    if (this._pingIntervalId) {
      clearInterval(this._pingIntervalId);
      this._pingIntervalId = null;
    }
  }

  // foreground'a gelince ping+sync tetikler (spam guard ile)
  _foregroundKick(delayMs) {
    const now = Date.now();
    if (now - this._lastForegroundKickAt < 800) return;
    this._lastForegroundKickAt = now;

    setTimeout(() => {
      if (this.disableReconnect) return;

      this.reconnectCheck();

      try {
        this.send("ping", {});
      } catch {}
      try {
        this.send("sync", {});
      } catch {}
    }, delayMs);
  }

  // visibility/focus/blur durumuna göre ping politikası uygular
  bindVisibilityReconnect(pingIntervalMs = 5000) {
    if (this._visibilityBound) return;
    this._visibilityBound = true;

    this._updateActiveState();
    this._applyPingPolicy(pingIntervalMs);

    this._visibilityHandler = () => {
      this._handleForeground(300, pingIntervalMs);
    };

    this._focusHandler = () => {
      this._handleForeground(200, pingIntervalMs);
    };

    this._blurHandler = () => {
      this._updateActiveState();
      this._applyPingPolicy(pingIntervalMs);
    };

    document.addEventListener("visibilitychange", this._visibilityHandler);
    window.addEventListener("focus", this._focusHandler);
    window.addEventListener("blur", this._blurHandler);

    this._freezeHandler = () => {
      this.isActive = false;
      this._applyPingPolicy(pingIntervalMs);
    };

    document.addEventListener("freeze", this._freezeHandler);
  }

  // tamamen kapatır: ping + listener + subs + bağlantı + callback temizliği
  destroy() {
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

  // refresh token ile access token yeniler ve bağlantıyı restart eder (lock'lu)
  async tryRefreshAndReconnect() {
    if (this._refreshInFlight) return this._refreshInFlight;

    this._refreshInFlight = (async () => {
      try {
        const refreshToken = sessionStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefresh } = res.data.data;

        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("refresh_token", newRefresh);

        await this._restartConnection();
      } catch (e) {
        if (this._onForceLogout) this._onForceLogout();
      } finally {
        this._refreshInFlight = null;
      }
    })();

    return this._refreshInFlight;
  }
}
