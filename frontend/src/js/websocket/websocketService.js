import WebSocketManager from "./websocket";

class WebSocketService {
  constructor() {
    this.ws = null;
  }

  init() {
    if (this.ws) {
      this.ws.destroy();
      this.ws = null;
    }
    this.ws = new WebSocketManager(import.meta.env.VITE_BASE_URL_WEBSOCKET);
    this.ws.startPing(5000);
    this.ws.bindVisibilityReconnect();
  }
  destroy() {
    if (!this.ws) return;

    this.ws.destroy();
    this.ws = null;
  }
}

export const webSocketService = new WebSocketService();
