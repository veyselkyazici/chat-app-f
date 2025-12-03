import { Client } from "@stomp/stompjs";

export default class WebSocketManager {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.subscriptions = new Map();
    this.pending = [];

    this.client = new Client({
      brokerURL: this.url,
      connectHeaders: { Authorization: `Bearer ${this.token}` },
      debug: () => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,

      onConnect: () => this.onConnected(),
      onStompError: (f) => this.onError(f),
      onWebSocketClose: () => this.onClose(),
    });

    // document.addEventListener("visibilitychange", () => {
    //   if (!document.hidden) {
    //     // Client AKTİF değilse → activate et
    //     if (!this.client.active) {
    //       this.client.activate();
    //       return;
    //     }

    //     // Client aktif ama bağlı değil → muhtemelen takıldı
    //     if (this.client.active && !this.client.connected) {
    //       this.client.deactivate();
    //       setTimeout(() => this.client.activate(), 300);
    //     }
    //   }
    // });
  }

  connect(onSuccess, onError) {
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
    this.client.deactivate();
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions.clear();
  }

  onConnected() {
    this.flushPending();
    if (this.onConnectCallback) this.onConnectCallback();
  }

  onError(err) {
    if (this.onErrorCallback) this.onErrorCallback(err);
  }

  onClose() {
    if (document.hidden) return;
  }

  flushPending() {
    this.pending.forEach((m) => {
      this.client.publish({ destination: m.destination, body: m.json });
    });
    this.pending = [];
  }
}
