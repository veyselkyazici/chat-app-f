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
      connectHeaders: { Authorization: `Bearer ${this.token}` },
      debug: () => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,

      onConnect: () => this.onConnected(),
      onStompError: (f) => this.onError(f),
      onWebSocketClose: () => this.onClose(),
    });

    window.addEventListener("focus", () => {
      if (!this.client.connected) {
        console.warn("WebSocket yeniden bağlanıyor", this.url);
        console.warn("1");

        if (this.client.active) {
          console.warn("2");
          this.client.deactivate().finally(() => {
            console.warn("3");
            setTimeout(() => {
              console.warn("4");
              this.client.activate(), 300;
            });
          });
        } else {
          console.warn("5");
          // hiç aktif değilse direkt activate et
          this.client.activate();
        }
      }
    });
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
    console.log("THIS CLIENT > ", this.client);
    console.log("THIS active > ", this.client.active);
    console.log("THIS connected > ", this.client.connected);
    console.log("THIS webSocket > ", this.client.webSocket);
    console.log("THIS onConnectCallback > ", this.client.onConnectCallback);
    console.log("THIS OPEN > ", WebSocket.OPEN);
    console.log("THIS readyState > ", this.client.webSocket.readyState);
  }

  onError(err) {
    console.error("STOMP ERROR:", err);
    if (this.onErrorCallback) this.onErrorCallback(err);
  }

  onClose() {
    if (document.hidden) return;
  }

  flushPending() {
    if (!this.client.connected) return;

    this.pending.forEach((m) => {
      this.client.publish({ destination: m.destination, body: m.json });
    });
    this.pending = [];
  }
  startHealthCheck() {
    if (this.healthInterval) return; // zaten çalışıyor

    this.healthInterval = setInterval(() => {
      const ws = this.client.webSocket;

      // STOMP "connected" diyor ama gerçek soket açık değilse → ghost state
      if (this.client.connected && ws && ws.readyState !== WebSocket.OPEN) {
        console.warn(
          "Ghost WebSocket tespit edildi, yeniden bağlanıyor... →",
          this.url
        );
        this.restart();
      }
    }, 5000);
  }

  stopHealthCheck() {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.healthInterval = null;
    }
  }

  restart() {
    this.stopHealthCheck();

    if (this.client.active) {
      this.client
        .deactivate()
        .finally(() => {
          this.client.activate();
        })
        .catch(() => {
          this.client.activate();
        });
    } else {
      this.client.activate();
    }
  }
}
