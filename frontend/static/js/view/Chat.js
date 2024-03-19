// Chat.js
import AbstractView from "./AbstractView.js";
import { addFriendView } from "./AddFriend2.js";
import FriendListView from "./FriendList.js";
import { friendApprovalView } from "./friendApproval.js";
import { friendRequestReplyNotificationView } from "./FriendRequestReplyNotificationView.js";
import WebSocketManager from "../websocket.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Chat");/* 
        this.renderChat()
        this.addEventListeners() */
        this.storedUser = sessionStorage.getItem('userId');
        this.chatList = [];
        this.friendList = [];
        this.fetchFriendRequestReplyData = [];
        this.friendListViewInstance = null;
        this.webSocketManagerFriendships = new WebSocketManager('http://127.0.0.1:9030/ws');
        this.webSocketManagerChat = new WebSocketManager('http://127.0.0.1:9040/ws');


        this.init()



        webSocketManagerFriendships = this.webSocketManagerFriendships;
        webSocketManagerChat = this.webSocketManagerChat;

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

            </div>
        </div>
        <div class="chat-box scrollbar" id="chatWindow">
            <div class="start-message">Arkadaş Seçerek Sohbet Etmeye Başlayabilirsiniz.</div>
        </div>
    </div>
        `;
    }

    async init() {
        this.initFriendshipWebSocket();
        this.initChatWebSocket()
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

    initChatWebSocket() {
        this.webSocketManagerChat.connectWebSocket({}, () => {
            this.webSocketManagerChat.subscribeToReceivedMessageResponseChannel(this.storedUser, async (receivesMessage) => {
                console.log("received ", receivesMessage)
            })
        }, function (error) {
            console.error('WebSocket connection error: ' + error);
        })
    }


    async initialData() {
        this.friendList = await fetchGetFriendList();
        this.chatList = await fetchGetChatList(this.storedUser);
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
                chatListHeaderElement.classList.add("vky");
                const backspaceBtnElement = document.getElementById("backspace");
                const friendListElement = document.getElementById("friend-list");
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
        console.log("handledata", friendList)
        if (!this.friendListViewInstance) {
            this.friendListViewInstance = new FriendListView(friendList);
            console.log("if")
        } else {
            this.friendListViewInstance.renderFriendList(friendList);
            console.log("else")
        }
        this.friendListViewInstance.render();
    }

    handleChatList() {
        const chatListArray = Object.values(this.chatList);


        const chatListElement = document.createElement("div");
        chatListElement.className = 'chat-list';
        chatListElement.innerHTML = '';



        chatListArray.forEach(chatRoom => {
            const chatElement = document.createElement('div');
            chatElement.className = 'chat';
            chatElement.innerHTML = `
                    <div class="left-side-friend-photo">${chatRoom.senderId}</div>
                    <div class="data">
                        <div class="name-and-date">
                            <div class="friend-name">${chatRoom.recipientId}</div>
                            <div class="last-message-date"></div>
                        </div>
                        
                    </div>
                `;


            console.log("useruseruser");
            chatListElement.appendChild(chatElement);
            const chatContent = document.querySelector(".chat-content")
           // chatContent.appendChild(chatListElement)

        });
    }
    async searchUsers() {
        console.log("asdfasdf")
        return await fetchGetFriendList();
    }
}

const getFriendList = 'http://localhost:8080/api/v1/friendships/get-friend-list';
const fetchGetFriendList = async () => {
    console.log("getfriendlist")
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
        console.log("result: ", result)
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};


const getChatList = 'http://localhost:8080/api/v1/chat/get-chat-list';
const fetchGetChatList = async (userId) => {
    const chatListRequestDTO = {
        userId: userId
    }
    try {
        const response = await fetch(getChatList, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(chatListRequestDTO),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        console.log("result: ", result)
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

async function fetchFriendRequestReply() {
    const requestBody = {
        userId: sessionStorage.getItem("userId")
    };
    try {
        const response = await fetch("http://localhost:8080/api/v1/friendships/friend-request-reply-notification", {
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


export let webSocketManagerFriendships;
export let webSocketManagerChat;