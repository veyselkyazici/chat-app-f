import { Client } from "@stomp/stompjs";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.isConnected = false;
    this.disableReconnect = false;
    this.subscriptions = new Map();
    this.activate = null;
    this._onConnect = null;
    this._onReconnect = null;
    this._onDisconnect = null;
    this._onForceLogout = null;

    this._pingIntervalId = null;
    this._visibilityHandler = null;
    this._focusHandler = null;
    this._visibilityBound = false;
    this._freezeHandler = null;
    this.client = new Client({
      brokerURL: this.url,

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

      // heartbeatIncoming: 20000,
      // heartbeatOutgoing: 20000,

      reconnectDelay: () => (this.disableReconnect ? null : 3000),

      debug: () => {},

      onConnect: () => {
        const wasConnectedBefore = this.isConnected;
        this.isConnected = true;

        this.resubscribeAll();

        if (!wasConnectedBefore && this._onConnect) {
          this._onConnect();
        } else if (wasConnectedBefore && this._onReconnect) {
          this._onReconnect();
        }
      },

      onWebSocketClose: () => {
        const wasConnected = this.isConnected;
        this.isConnected = false;

        if (!this.disableReconnect) {
          if (wasConnected && this._onDisconnect) {
            this._onDisconnect();
          }
        }
      },

      onStompError: async (frame) => {
        const code = frame.headers.message;

        if (code === "TOKEN_EXPIRED") {
          try {
            const refreshToken = sessionStorage.getItem("refresh_token");

            const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefresh } = res.data.data;

            sessionStorage.setItem("access_token", accessToken);
            sessionStorage.setItem("refresh_token", newRefresh);

            this.refreshToken();
            return;
          } catch (e) {
            if (this._onForceLogout) this._onForceLogout();
            return;
          }
        }

        if (code === "INVALID_SESSION") {
          if (this._onForceLogout) this._onForceLogout();
        }

        if (code === "INVALID_TOKEN") {
          if (this._onForceLogout) this._onForceLogout();
        }
      },
    });
  }
  onForceLogout(cb) {
    this._onForceLogout = cb;
  }

  connect(onConnectCallback) {
    this._onConnect = onConnectCallback;
    this.client.activate();
  }

  onReconnect(cb) {
    this._onReconnect = cb;
  }

  onDisconnect(cb) {
    this._onDisconnect = cb;
  }

  disconnect() {
    this.disableReconnect = true;

    for (const [, data] of this.subscriptions.entries()) {
      try {
        data.stompSubscription?.unsubscribe();
      } catch {}
    }

    this.subscriptions.clear();
    this.isConnected = false;

    this.client.deactivate();
  }

  subscribe(channel, callback) {
    this.subscriptions.set(channel, {
      callback,
      stompSubscription: null,
    });

    if (this.isConnected) {
      const stompSub = this.client.subscribe(channel, callback);
      this.subscriptions.get(channel).stompSubscription = stompSub;
    }
  }

  resubscribeAll() {
    for (const [, data] of this.subscriptions.entries()) {
      try {
        data.stompSubscription?.unsubscribe();
        const stompSub = this.client.subscribe(channel, data.callback);
        data.stompSubscription = stompSub;
      } catch {}
    }
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

    this.client.publish({
      destination: "/app/" + destination,
      body: JSON.stringify(body),
    });
  }

  refreshToken() {
    this.disableReconnect = false;

    this.client.deactivate().then(() => {
      this.client.connectHeaders = {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      };

      this.client.activate();
    });
  }

  async reconnectCheck() {
    if (this.disableReconnect) return;

    if (!this.isConnected) {
      this.client.deactivate().then(() => this.client.activate());
      return;
    }

    try {
      this.client.publish({
        destination: "/app/ping",
        body: "{}",
      });
    } catch {
      this.client.deactivate().then(() => this.client.activate());
    }
  }

  startPing(intervalMs) {
    if (this._pingIntervalId) return;
    this._pingIntervalId = setInterval(() => {
      if (!this.isConnected || !this.isActive) return;
      try {
        this.client.publish({
          destination: "/app/ping",
          body: "{}",
        });
      } catch (e) {
        this.reconnectCheck();
      }
    }, intervalMs);
  }

  bindVisibilityReconnect() {
    if (this._visibilityBound) return;
    this._visibilityBound = true;

    const updateActiveState = () => {
      this.isActive = !document.hidden && document.hasFocus();
    };

    updateActiveState();

    this._visibilityHandler = () => {
      updateActiveState();
      if (this.isActive && !this.disableReconnect) {
        setTimeout(() => this.reconnectCheck(), 300);
      }
    };

    this._focusHandler = () => {
      updateActiveState();
      if (this.isActive && !this.disableReconnect) {
        setTimeout(() => this.reconnectCheck(), 200);
      }
    };

    document.addEventListener("visibilitychange", this._visibilityHandler);
    window.addEventListener("focus", this._focusHandler);

    this._blurHandler = () => updateActiveState();
    window.addEventListener("blur", this._blurHandler);

    this._freezeHandler = () => {
      this.isActive = false;
    };
    document.addEventListener("freeze", this._freezeHandler);
  }

  destroy() {
    this.disableReconnect = true;
    this.isConnected = false;

    if (this._pingIntervalId) {
      clearInterval(this._pingIntervalId);
      this._pingIntervalId = null;
    }

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

    for (const [, data] of this.subscriptions.entries()) {
      try {
        data.stompSubscription?.unsubscribe();
      } catch {}
    }
    this.subscriptions.clear();

    try {
      this.client.deactivate();
    } catch {}

    this._onConnect = null;
    this._onReconnect = null;
    this._onDisconnect = null;
    this._onForceLogout = null;
  }
}
