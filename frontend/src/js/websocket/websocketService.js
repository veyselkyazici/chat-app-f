import WebSocketManager from "./WebSocketManager";

class WebSocketService {
  constructor() {
    this.chatWS = null;
    this.contactsWS = null;
  }

  init() {
    this.chatWS = new WebSocketManager(
      import.meta.env.VITE_BASE_URL_WEBSOCKET_CHAT
    );
    this.contactsWS = new WebSocketManager(
      import.meta.env.VITE_BASE_URL_WEBSOCKET_CONTACTS
    );
  }

  refreshAll() {
    this.chatWS?.refreshToken();
    this.contactsWS?.refreshToken();
  }
}

export const webSocketService = new WebSocketService();
