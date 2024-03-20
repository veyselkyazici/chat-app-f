// Chat.js
import AbstractView from "./AbstractView.js";
import { addFriendView } from "./AddFriend2.js";
import FriendListView from "./Friends.js";
import { friendApprovalView } from "./IncomingFriendRequests.js";
import { friendRequestReplyNotificationView } from "./ApprovedRequestHistory.js";
import WebSocketManager from "../websocket.js";

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
        this.storedUser = null;
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
            <div class="friend-list-content vky" id="friend-list-content">

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
        await this.initFriendshipWebSocket();
        await this.initChatWebSocket()
        await this.initialData();
        this.handleChatList();
    }

    async initFriendshipWebSocket() {
        this.webSocketManagerFriendships.connectWebSocket({}, () => {
            this.webSocketManagerFriendships.subscribeToFriendRequestFriendResponseChannel(this.storedUser, async (friendRequest) => {
                const friendRequestBody = JSON.parse(friendRequest.body);
                console.log("friendRequestBody: ", friendRequestBody)
                this.friendRequestNotification(true);
            });
            this.webSocketManagerFriendships.subscribeToFriendRequestUserResponseChannel(this.storedUser, async (friendRequest) => {
                const friendRequestBody = JSON.parse(friendRequest.body);
                friendRequestBody.statusCode === 400 ? toastr.error(friendRequestBody.message) : toastr.success(friendRequestBody.message);
            });
            this.webSocketManagerFriendships.subscribeToFriendRequestReplyNotificationUserResponseChannel(this.storedUser, async (friendRequest) => {
                const friendRequestBody = JSON.parse(friendRequest.body);
                toastr.success(friendRequestBody + " isteğinizi onayladı")
                this.friendRequestReplyNotificationBadge(true);
                this.fetchFriendRequestReplyData = await fetchFriendRequestReply();
                this.friendList = await fetchGetFriendList();
            });
            this.webSocketManagerFriendships.subscribeToFriendRequestReplyNotificationFriendResponseChannel(this.storedUser, async (friendRequest) => {
                const friendRequestBody = JSON.parse(friendRequest.body);
                toastr.success(friendRequestBody + " kişisini arkadaş eklediniz")
                this.friendList = await fetchGetFriendList();
            });
        },
            function (error) {
                console.error('WebSocket connection error: ' + error);
            });
    }

    async initChatWebSocket() {
        this.webSocketManagerChat.connectWebSocket({}, () => {
            this.webSocketManagerChat.subscribeToReceivedMessageResponseChannel(this.storedUser, async (receivesMessage) => {
                console.log("received ", receivesMessage)
            })
        }, function (error) {
            console.error('WebSocket connection error: ' + error);
        })
    }


    async initialData() {
        this.storedUser = await fetchGetUserId();
        this.friendList = await fetchGetFriendList();
        this.chatList = await fetchGetChatList();
    }

    addEventListeners() {
        const searchButtonElement = document.querySelector(".search-button");
        if (searchButtonElement) {
            searchButtonElement.addEventListener("click", deneme1);
        }

        const addFriendButtonElement = document.querySelector(".add-friendd");
        if (addFriendButtonElement) {
            addFriendButtonElement.addEventListener("click", () => {
                addFriendView(webSocketManagerFriendships)
            });
        }

        const chatListHeaderElement = document.querySelector(".chat-list-header");
        const friendListButtonElement = document.querySelector(".friend-list-btn");
        if (friendListButtonElement) {
            friendListButtonElement.addEventListener("click", () => {
                this.handleInitialFriendList(this.friendList);
                const backspaceBtnElement = document.getElementById("backspace");
                const friendListElement = document.getElementById("friend-list-content");
                chatListHeaderElement.classList.add("vky");
                if(friendListElement.classList.contains("vky")){
                    friendListElement.classList.remove("vky");
                }
                
                backspaceBtnElement.addEventListener("click", () => {
                    friendListElement.classList.add("vky")
                    chatListHeaderElement.classList.remove("vky")
                })
            });
        }

        const friendApprovalButtonElement = document.querySelector(".friend-approval");
        if (friendApprovalButtonElement) {
            friendApprovalButtonElement.addEventListener("click",
                () => {
                    friendApprovalView(this.webSocketManagerFriendships)
                    this.friendRequestNotification(false);
                });
        }

        const friendRequestReplyNotificationElement = document.querySelector(".friend-request-reply-notification");
        if (friendRequestReplyNotificationElement) {
            friendRequestReplyNotificationElement.addEventListener("click", () => {
                friendRequestReplyNotificationView(this.fetchFriendRequestReplyData)
                this.friendRequestReplyNotificationBadge(false)
            });
        }

        const chatsElement = document.querySelector(".chats");
        if (chatsElement) {
            chatsElement.addEventListener("click", () => {
                console.log(fetchGetChatList(this.storedUser))
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
        if (!this.friendListViewInstance) {
            this.friendListViewInstance = new FriendListView(friendList);
        } else {
            this.friendListViewInstance.renderFriendList(friendList);
        }
        this.friendListViewInstance.render();
    }

    handleChatList() {
        console.log("chatLIST: ", this.chatList)
    }
    

}

const getFriendList = 'http://localhost:8080/api/v1/friendships/get-friend-list';
const fetchGetFriendList = async () => {
    try {
        const response = await fetch(getFriendList, {
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
    const requestBody = {
        userId: sessionStorage.getItem("userId")
    };
    try {
        const response = await fetch(getFriendRequestReplyUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(requestBody)
        });
        const data = response.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}

const getUserIdUrl = 'http://localhost:8080/api/v1/user/get-userId';
async function fetchGetUserId() {
    try {
        const response = await fetch(getUserIdUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({token: sessionStorage.getItem('access_token')}), 
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        console.log("fetchGetUserId: ", data.userId)
        return data.userId;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error; 
    }
}

