import { Client } from "@stomp/stompjs";

export default class WebSocketManager {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.subscriptions = new Map();
    this.pending = [];
    this.healthInterval = null;

    this.client = new Client({
      brokerURL: this.url,
      connectHeaders: {
        get Authorization() {
          return `Bearer ${sessionStorage.getItem("access_token")}`;
        },
      },

      debug: () => {},
      onConnect: () => this.onConnected(),
      onStompError: (f) => this.onError(f),
      onWebSocketClose: () => this.onClose(),
    });
  }

  connect(onSuccess, onError) {
    console.log("1");
    this.onConnectCallback = onSuccess;
    this.onErrorCallback = onError;
    this.client.activate();
  }

  subscribe(channel, cb) {
    if (this.client.connected) {
      const sub = this.client.subscribe(channel, cb);
      this.subscriptions.set(channel, sub);
    } else {
      setTimeout(() => this.subscribe(channel, cb), 120);
    }
  }

  unsubscribe(channel) {
    if (this.subscriptions.has(channel)) {
      this.subscriptions.get(channel).unsubscribe();
      this.subscriptions.delete(channel);
    }
  }

  send(destination, body) {
    const json = JSON.stringify(body);
    const fullDestination = "/app/" + destination;

    if (!this.client.connected) {
      this.pending.push({ destination: fullDestination, json });
      return;
    }

    this.client.publish({ destination: fullDestination, body: json });
  }

  disconnect() {
    this.stopHealthCheck();
    this.client.deactivate();
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions.clear();
  }

  onConnected() {
    this.startHealthCheck();
    this.flushPending();

    if (this.onConnectCallback) this.onConnectCallback();
  }

  onError(err) {
    if (this.onErrorCallback) this.onErrorCallback(err);
  }

  onClose() {}

  flushPending() {
    if (!this.client.connected) return;

    this.pending.forEach((m) => {
      this.client.publish({ destination: m.destination, body: m.json });
    });
    this.pending = [];
  }
  startHealthCheck() {
    if (this.healthInterval) return;

    this.healthInterval = setInterval(() => {
      const ws = this.client.webSocket;

      if (!ws) {
        this.restart();
        return;
      }
      if (this.client.connected && ws.readyState !== WebSocket.OPEN) {
        this.restart();
        return;
      }

      if (!this.client.connected && ws.readyState === WebSocket.OPEN) {
        this.restart();
        return;
      }
    }, 5000);
  }

  restart() {
    this.stopHealthCheck();

    if (this.client.active) {
      this.client.deactivate().finally(() => {
        setTimeout(() => this.client.activate(), 300);
      });
    } else {
      this.client.activate();
    }
  }

  stopHealthCheck() {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.healthInterval = null;
    }
  }
}
