import { Client } from "@stomp/stompjs";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.isConnected = false;

    this.subscriptions = new Map();

    this._onConnect = null;
    this._onReconnect = null;
    this._onDisconnect = null;

    this.client = new Client({
      brokerURL: this.url,

      beforeConnect: () => {
        this.client.connectHeaders = {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        };
      },

      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      reconnectDelay: 3000,

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

        if (wasConnected && this._onDisconnect) {
          this._onDisconnect();
        }
      },

      onStompError: async (frame) => {
        console.error("STOMP ERROR:", frame);

        const code = frame.headers.message;

        if (code === "EXPIRED_TOKEN") {
          try {
            const refreshTokenSession = sessionStorage.getItem("refresh_token");
            const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
              refreshToken: refreshTokenSession,
            });
            const { accessToken, refreshToken } = res.data.data;
            sessionStorage.setItem("access_token", accessToken);
            sessionStorage.setItem("refresh_token", refreshToken);

            // 2) Yeni token ile WS'leri yeniden bağla
            this.refreshToken();
          } catch (e) {
            console.error("WS token refresh failed", e);
            window.location.href = "/login";
          }
        }
      },
    });
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
    for (const [, data] of this.subscriptions.entries()) {
      try {
        data.stompSubscription?.unsubscribe();
      } catch (e) {
        console.warn("unsubscribe error:", e);
      }
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
    for (const [channel, data] of this.subscriptions.entries()) {
      try {
        const stompSub = this.client.subscribe(channel, data.callback);
        data.stompSubscription = stompSub;
      } catch (e) {
        console.warn("resubscribe error:", e);
      }
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
    this.client.deactivate().then(() => {
      this.client.activate();
    });
  }
}
