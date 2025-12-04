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
        Authorization: `Bearer ${this.token}`,
      },

      debug: () => {},
      reconnectDelay: 0,

      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

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
    console.log("2");
    this.stopHealthCheck();
    this.client.deactivate();
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions.clear();
  }

  onConnected() {
    console.info("WebSocket connected:", this.url);

    this.startHealthCheck();
    this.flushPending();

    if (this.onConnectCallback) this.onConnectCallback();
  }

  onError(err) {
    console.error("STOMP ERROR:", err);
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
    console.log("3");
    if (this.healthInterval) return;
    console.log("4");
    this.healthInterval = setInterval(() => {
      const ws = this.client.webSocket;
      console.log("CONNECT > ", this.client.connected);
      console.log("WS > ", ws ? ws : null);
      console.log("client > ", this.client);
      console.log("5");
      if (this.client.connected && ws && ws.readyState !== WebSocket.OPEN) {
        console.log("6");
        this.restart();
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
