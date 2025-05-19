class WebSocketManager {
    constructor(webSocketUrl, userId) {
        this.webSocketUrl = webSocketUrl;
        this.userId = userId;
        this.stompClient = null;
        this.subscriptions = new Map();
    }

    connectWebSocket(successCallback = () => { }, errorCallback = () => { }) {
        try {
            this.sockJs = new SockJS(this.webSocketUrl);
            this.stompClient = Stomp.over(this.sockJs);
            this.stompClient.connect({ userId: this.userId }, () => {
                successCallback();
                this.notifyOnlineStatus(true);
            }, (error) => {
                errorCallback(error);
                this.notifyOnlineStatus(false);
            });
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
        for (const [key, value] of this.subscriptions) {
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
        if (this.stompClient) {
            try {
                const appChannel = `/app/${endpoint}`;
                this.stompClient.send(appChannel, {}, JSON.stringify(message));
            } catch (error) {
                console.error('Error sending message to channel:', error);
            }
        }
    }

    async notifyOnlineStatus(isOnline) {
        if (isOnline) {
            this.sendMessageToAppChannel('user-online', { userId: this.userId, online: true });
        } else {
            await fetchUpdateUserLastSeen(this.userId)
            this.sendMessageToAppChannel('user-offline', { userId: this.userId, online: false });
        }
    }

    getSubscribedChannels() {
        return Array.from(this.subscriptions.keys());
    }
}

const fetchUpdateUserLastSeenUrl = 'http://localhost:8080/api/v1/user/update-user-last-seen';
const fetchUpdateUserLastSeen = async (userId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(fetchUpdateUserLastSeenUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ userId: userId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toastr.error(errorData.message);
            throw new Error(errorData.message);
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

export default WebSocketManager;