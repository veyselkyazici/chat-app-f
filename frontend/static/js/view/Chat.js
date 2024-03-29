// Chat.js
import AbstractView from "./AbstractView.js";
import { addFriendView } from "./AddFriend2.js";
import createFriendList from "./Friends.js";
import { createIncomingFriendRequests } from "./IncomingFriendRequests.js";
import { createApprovedRequestHistory } from "./ApprovedRequestHistory.js";
import WebSocketManager from "../websocket.js";
import { hideElements } from './util.js'

export let webSocketManagerFriendships;
export let webSocketManagerChat;
webSocketManagerFriendships = new WebSocketManager('http://127.0.0.1:9030/ws');
webSocketManagerChat = new WebSocketManager('http://127.0.0.1:9040/ws');

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Chat");/* 
        this.renderChat()
        this.addEventListeners() */
        this.userId = '';
        this.chatList = {};
        this.friendList = [];
        this.fetchFriendRequestReplyData = [];


        this.friendListViewInstance = null;
        this.webSocketManagerFriendships = webSocketManagerFriendships;
        this.webSocketManagerChat = webSocketManagerChat;
        this.init()
    }

    /* async renderChat () {
        const chatHtml = `<div class="chat-container">
        <div class="left-side">
            <header class="chat-list-header">
                <div class="user-photo">
                    <div class="user-profile-photo" role="button" style="height: 40px; width: 40px; cursor: pointer;">
                        <img class="user-image" tabindex="0" src="/static/image/default-user-profile-photo.png"
                            alt="Varsayılan Fotoğraf" id="profilePhoto" />
                    </div>
                </div>
                <div class="options-div">
                    <div class="options">
                        <div class="friend-list-btn option" tabindex="0" role="button"
                            title="Yeni Sohbet Başlat" aria-label="Yeni Sohbet Başlat"><span class="friend-list-icon option material-symbols-outlined">
                            chat_add_on
                            </span></div>
                        <div class="fa-solid fa-plus add-friendd option" tabindex="0" role="button" title="Arkadaş Ekle"
                            aria-label="Arkadaş Ekle"></div>
                        <div class="fa-solid fa-user-plus friend-approval option" tabindex="0" role="button" title="Gelen İstekler" aria-label="Gelen İstekler"><div class="notification-badge" style="display: none;"></div></div>
                        <div class="fa-solid fa-bell friend-request-reply-notification option" tabindex="0" role="button"
                        title="Bildirimler" aria-label="Bildirimler"><div class="notification-badge" style="display: none;"></div></div>
                        <div class="fa-solid fa-gear settings option" tabindex="0" role="button" title="Seçenekler"
                            aria-label="Seçenekler"></div>
                    </div>
                </div>
            </header>
            <div class="chat-content">

            </div>
        </div>
        <div class="chat-box scrollbar" id="chatWindow">
            <div class="start-message">Arkadaş Seçerek Sohbet Etmeye Başlayabilirsiniz.</div>
        </div>
    </div>`
    document.querySelector("#content").innerHTML = chatHtml;
    } */

    async getHtml() {
        return `
        <div class="chat-container">
        <div class="left-side">
            <header class="chat-list-header">
                <div class="user-photo">
                    <div class="user-profile-photo" role="button" style="height: 40px; width: 40px; cursor: pointer;">
                        <img class="user-image" tabindex="0" src="/static/image/default-user-profile-photo.png"
                            alt="Varsayılan Fotoğraf" id="profilePhoto" />
                    </div>
                </div>
                <div class="options-div">
                    <div class="options">
                        <div class="friend-list-btn option" tabindex="0" role="button"
                            title="Yeni Sohbet Başlat" aria-label="Yeni Sohbet Başlat"><span class="friend-list-icon option material-symbols-outlined">
                            chat_add_on
                            </span></div>
                        <div class="fa-solid fa-plus add-friendd option" tabindex="0" role="button" title="Arkadaş Ekle"
                            aria-label="Arkadaş Ekle"></div>
                        <div class="fa-solid fa-user-plus friend-approval option" tabindex="0" role="button" title="Gelen İstekler" aria-label="Gelen İstekler"><div class="notification-badge" style="display: none;"></div></div>
                        <div class="fa-solid fa-bell friend-request-reply-notification option" tabindex="0" role="button"
                        title="Bildirimler" aria-label="Bildirimler"><div class="notification-badge" style="display: none;"></div></div>
                        <div class="fa-solid fa-gear settings option" tabindex="0" role="button" title="Seçenekler"
                            aria-label="Seçenekler"></div>
                    </div>
                </div>
            </header>
            <div class="chat-content">
                <div class="chat-list-content">

                </div>

            </div>
        </div>
        <div class="chat-box scrollbar" id="chatWindow">
            <div class="start-message">Arkadaş Seçerek Sohbet Etmeye Başlayabilirsiniz.</div>
        </div>
    </div>
        `;
    }

    async init() {
        await this.initialData();
        this.initFriendshipWebSocket();
        this.initChatWebSocket()
        this.handleChatList();
    }

    async initFriendshipWebSocket() {
        this.webSocketManagerFriendships.connectWebSocket(() => {
            this.subscribeToFriendshipChannels();
        }, error => {
            console.error('WebSocket bağlantı hatası: ' + error);
        });
    }

    subscribeToFriendshipChannels() {

        const friendResponseChannel = `/user/${this.userId}/queue/friend-request-friend-response`;
        const userChannel = `/user/${this.userId}/queue/friend-request-user-response`;
        const notificationChannel = `/user/${this.userId}/queue/friend-request-reply-notification-user-response`;
        const notificationFriendChannel = `/user/${this.userId}/queue/friend-request-reply-notification-friend-response`;
        const sendMessageChannel = `/user/${this.userId}/queue/received-message`;

        this.webSocketManagerFriendships.subscribeToChannel(friendResponseChannel, async (incomingFriendRequest) => {
            const incomingFriendRequestBody = JSON.parse(incomingFriendRequest.body);
            console.log("incomingFriendRequestBody: ", incomingFriendRequestBody)
            console.log("Arkadaşlık isteği bilgisi: ", incomingFriendRequestBody)
            this.friendRequestNotification(true);
        });
        // Arkadaş ekleme isteği başarılı olduğunda toastr mesaji geçer isteği gonderen kullaniciya
        this.webSocketManagerFriendships.subscribeToChannel(userChannel, async (friendRequest) => {
            console.log("istek gönderildi")
            const friendRequestBody = JSON.parse(friendRequest.body);
            friendRequestBody.statusCode === 400 ? toastr.error(friendRequestBody.message) : toastr.success(friendRequestBody.message);
        });
        // Eğer istek onaylanirsa isteği gönderen kişiye toastr mesaji çıkartılır. Arkadaş listesi tekrar fetch edilir.
        this.webSocketManagerFriendships.subscribeToChannel(notificationChannel, async (friendRequest) => {
            const friendRequestBody = JSON.parse(friendRequest.body);
            toastr.success(friendRequestBody + " isteğinizi onayladı")
            this.friendRequestReplyNotificationBadge(true);
            this.fetchFriendRequestReplyData = await fetchFriendRequestReply();
            this.friendList = await fetchGetFriendList();
        });
        // Isteği onaylayan kişiye toastre mesajo çıkartılır. Arkadaş listesi tekrar fetch edilir.
        this.webSocketManagerFriendships.subscribeToChannel(notificationFriendChannel, async (friendRequest) => {
            const friendRequestBody = JSON.parse(friendRequest.body);
            toastr.success(friendRequestBody + " kişisini arkadaş eklediniz")
            this.friendList = await fetchGetFriendList();
        });
        console.log("SUBSCRIBE")

        const message = { text: 'Merhaba, dünya!' };
        this.webSocketManagerFriendships.sendMessageToAppChannel(sendMessageChannel, message);
    }

    initChatWebSocket() {
        this.webSocketManagerChat.connectWebSocket({}, () => {
            this.subscribeToChatChannels
        }, function (error) {
            console.error('WebSocket connection error: ' + error);
        })
    }


    async initialData() {
        this.userId = await fetchGetUserId();
        console.log("InitialData userId: ", this.userId)
        this.friendList = await fetchGetFriendList();
        // this.chatList = await fetchGetChatList();
    }


    addEventListeners() {
        const chatListContentElement = document.querySelector(".chat-list-content")
        const addFriendButtonElement = document.querySelector(".add-friendd");
        const chatListHeaderElement = document.querySelector(".chat-list-header");
        const friendListButtonElement = document.querySelector(".friend-list-btn");
        const friendApprovalButtonElement = document.querySelector(".friend-approval");
        const friendRequestReplyNotificationElement = document.querySelector(".friend-request-reply-notification");
        const chatsElement = document.querySelector(".chats");



        if (addFriendButtonElement) {
            addFriendButtonElement.addEventListener("click", () => {
                addFriendView(webSocketManagerFriendships)
            });
        }

        if (friendListButtonElement) {
            friendListButtonElement.addEventListener("click", () => {
                hideElements(chatListHeaderElement, chatListContentElement)
                this.handleInitialFriendList(this.friendList);
            });
        }

        if (friendApprovalButtonElement) {
            friendApprovalButtonElement.addEventListener("click",
                () => {
                    hideElements(chatListHeaderElement, chatListContentElement)
                    createIncomingFriendRequests()
                    this.friendRequestNotification(false);
                });
        }

        if (friendRequestReplyNotificationElement) {
            friendRequestReplyNotificationElement.addEventListener("click", () => {
                hideElements(chatListHeaderElement, chatListContentElement)
                createApprovedRequestHistory(this.fetchFriendRequestReplyData)
                this.friendRequestReplyNotificationBadge(false)
            });
        }

        if (chatsElement) {
            chatsElement.addEventListener("click", () => {
                console.log(fetchGetChatList(this.userId))
            });
        }
    }

    friendRequestNotification(showBadge) {
        const notificationBadgeElement = document.querySelector('.friend-approval .notification-badge');
        if (notificationBadgeElement) {
            notificationBadgeElement.style.display = showBadge ? 'block' : 'none';
        }
    }
    friendRequestReplyNotificationBadge(showBadge) {
        const replyNotificationBadgeElement = document.querySelector('.friend-request-reply-notification .notification-badge');
        if (replyNotificationBadgeElement) {
            replyNotificationBadgeElement.style.display = showBadge ? 'block' : 'none';
        }
    }

    handleInitialFriendList(friendList) {
        createFriendList(friendList);
    }

    handleChatList() {
        console.log("chatLIST: ", this.chatList)
    }


}

const getFriendList = 'http://localhost:8080/api/v1/friendships/get-friend-list';
const fetchGetFriendList = async () => {
    try {
        const response = await fetch(getFriendList, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        console.log("fetchFriendList: ", result)
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};


const getChatList = 'http://localhost:8080/api/v1/chat/get-chat-list';
const fetchGetChatList = async () => {

    try {
        const response = await fetch(getChatList, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ token: sessionStorage.getItem('access_token') }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        console.log("fetchChatList: ", result)
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

const getFriendRequestReplyUrl = "http://localhost:8080/api/v1/friendships/friend-request-reply-notification";
async function fetchFriendRequestReply() {
    try {
        const response = await fetch(getFriendRequestReplyUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}

const getUserIdUrl = 'http://localhost:8080/api/v1/user/get-userId';
async function fetchGetUserId() {
    const requestBody = { token: sessionStorage.getItem('access_token') };
    try {
        const response = await fetch(getUserIdUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data.userId;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}


