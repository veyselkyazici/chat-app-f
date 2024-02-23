// WebSocketManager.js
class WebSocketManager {
  constructor(webSocketUrl) {
      this.sockJs = new SockJS(webSocketUrl);
      this.stompClient = Stomp.over(this.sockJs);
  }

  connectWebSocket(successCallback, errorCallback) {
      this.stompClient.connect({}, successCallback, errorCallback);
  }

  disconnectWebSocket() {
      if (this.stompClient) {
          this.stompClient.disconnect();
      }
  }

  subscribeToFriendRequestFriendResponseChannel(userId,callback) {
      if (this.stompClient) {
          const userChannel = `/user/${userId}/queue/friend-request-friend-response`;
          this.stompClient.subscribe(userChannel, callback);
      }
  }
  subscribeToFriendRequestUserResponseChannel(userId,callback) {
    if (this.stompClient) {
        const userChannel = `/user/${userId}/queue/friend-request-user-response`;
        this.stompClient.subscribe(userChannel, callback);
    }
}
  subscribeToFriendRequestReplyNotificationUserResponseChannel(userId,callback) {
    if (this.stompClient) {
        const userChannel = `/user/${userId}/queue/friend-request-reply-notification-user-response`;
        this.stompClient.subscribe(userChannel, callback);
    }
}
subscribeToFriendRequestReplyNotificationFriendResponseChannel(userId,callback) {
    if (this.stompClient) {
        const userChannel = `/user/${userId}/queue/friend-request-reply-notification-friend-response`;
        this.stompClient.subscribe(userChannel, callback);
    }
}
  sendMessageToAppChannel(endpoint, message) {
      if (this.stompClient) {
          const appChannel = `/app/${endpoint}`;
          this.stompClient.send(appChannel, {}, JSON.stringify(message));
      }
  }
}

export default WebSocketManager;
