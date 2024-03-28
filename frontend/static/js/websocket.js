class WebSocketManager {
    constructor(webSocketUrl) {
        this.webSocketUrl = webSocketUrl;
        this.stompClient = null;
        this.subscriptions = new Map();
    }
  
    connectWebSocket(successCallback, errorCallback) {
        try {
            this.sockJs = new SockJS(this.webSocketUrl);
            this.stompClient = Stomp.over(this.sockJs);
            this.stompClient.connect({}, successCallback, errorCallback);
        } catch (error) {
            console.error('WebSocket connection error:', error);
            if (errorCallback) errorCallback(error);
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
        if (this.stompClient) {
            const subscription = this.stompClient.subscribe(channel, callback);
            this.subscriptions.set(channel, subscription);
            return subscription;
        }
        return null;
    }
  
    unsubscribeFromChannel(channel) {
        if (this.subscriptions.has(channel)) {
            const subscription = this.subscriptions.get(channel);
            subscription.unsubscribe();
            this.subscriptions.delete(channel);
        }
    }

    sendMessageToAppChannel(endpoint, message) {
        if (this.stompClient) {
            try {
                const appChannel = `/app/${endpoint}`;
                this.stompClient.send(appChannel, {}, JSON.stringify(message));
            } catch (error) {
                console.error('Error sending message to channel:', error);
            }
        }
    }
}

export default WebSocketManager;