class WebSocketManager {
  constructor(webSocketUrl, userId, token) {
    this.webSocketUrl = webSocketUrl;
    this.userId = userId;
    this.token = token;
    this.stompClient = null;
    this.subscriptions = new Map();
    this.pending = [];
  }

  connectWebSocket(successCallback = () => {}, errorCallback = () => {}) {
    try {
      this.sockJs = new SockJS(this.webSocketUrl);
      this.stompClient = Stomp.over(this.sockJs);
      this.stompClient.debug = (str) => {
        // console.log("STOMP Debug:", str);
      };
      this.stompClient.connect(
        {
          Authorization: `Bearer ${this.token}`,
        },
        () => {
          this.pending.forEach((m) =>
            this.stompClient.send(m.channel, {}, m.payload)
          );

          this.pending = [];
          successCallback();
          // this.notifyOnlineStatus(true);
        },
        (error) => {
          errorCallback(error);
          // this.notifyOnlineStatus(false);
        }
      );
    } catch (error) {
      errorCallback(error);
    }
  }

  disconnectWebSocket() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
    }
  }

  subscribeToChannel(channel, callback) {
    if (this.stompClient && !this.subscriptions.has(channel)) {
      const subscription = this.stompClient.subscribe(channel, callback);
      this.subscriptions.set(channel, subscription);
    }
  }

  unsubscribeFromChannel(channel) {
    if (this.subscriptions.has(channel)) {
      const subscription = this.subscriptions.get(channel);
      subscription.unsubscribe();
      this.subscriptions.delete(channel);
    }
  }

  sendMessageToAppChannel(endpoint, message) {
    const channel = `/app/${endpoint}`;
    const payload = JSON.stringify(message);

    if (!this.stompClient || !this.stompClient.connected) {
      console.warn("WS not ready → queued:", endpoint);
      this.pending.push({ channel, payload });
      return;
    }
    this.stompClient.send(channel, {}, payload);
  }

  // async notifyOnlineStatus(isOnline) {
  //   if (isOnline) {
  //     this.sendMessageToAppChannel("user-online", {
  //       online: true,
  //     });
  //   } else {
  //     await userService.updateUserLastSeen();
  //     this.sendMessageToAppChannel("user-offline", {
  //       online: false,
  //     });
  //   }
  // }

  getSubscribedChannels() {
    return Array.from(this.subscriptions.keys());
  }
}

export default WebSocketManager;
