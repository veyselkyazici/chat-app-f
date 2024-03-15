// Chat.js
import AbstractView from "./AbstractView.js";
import { addFriendView } from "./AddFriend2.js";
import  FriendListView  from "./FriendList.js";
import { friendApprovalView } from "./friendApproval.js";
import { friendRequestReplyNotificationView } from "./FriendRequestReplyNotificationView.js";
import WebSocketManager from "../websocket.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Chat");
        this.friendList = [];
        this.fetchFriendRequestReplyData = [];
        this.friendListViewInstance = null;
        this.webSocketManagerFriendships = new WebSocketManager('http://127.0.0.1:9030/ws');
        this.webSocketManagerChat = new WebSocketManager('http://127.0.0.1:9040/ws');

        this.init()

        webSocketManagerFriendships = this.webSocketManagerFriendships;
        webSocketManagerChat = this.webSocketManagerChat;

    }

    async getHtml() {
        return `
        <div class="chat-container">
        <div class="left-side">
            <header class="chat-list-haeder">
                <div class="user-photo">
                    <div class="user-profile-photo" role="button" style="height: 40px; width: 40px; cursor: pointer;">
                        <img class="user-image" tabindex="0" src="/static/image/default-user-profile-photo.png"
                            alt="Varsayılan Fotoğraf" id="profilePhoto" />
                    </div>
                </div>
                <div class="options-div">
                    <div class="options">
                        <div class="fa-solid fa-user-group friend-list option" tabindex="0" role="button"
                            title="Arkadaşlar" aria-label="Arkadaşlar"></div>
                        <div class="fa-solid fa-plus add-friendd option" tabindex="0" role="button" title="Arkadaş Ekle"
                            aria-label="Arkadaş Ekle"></div>
                        <div class="fa-solid fa-user-plus friend-approval option" tabindex="0" role="button" title="Gelen İstekler" aria-label="Gelen İstekler"><div class="notification-badge" style="display: none;"></div></div>
                        <div class="fa-solid fa-bell friend-request-reply-notification option" tabindex="0" role="button"
                        title="Bildirimler" aria-label="Bildirimler"><div class="notification-badge" style="display: none;"></div></div>
                        <div class="fa-solid fa-message chatt option" tabindex="0" role="button" title="Sohbetler"
                            aria-label="Sohbetler"></div>
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
        const storedUser = sessionStorage.getItem('userId');
        console.log(storedUser)
        this.initFriendshipWebSocket(storedUser);
        await this.initialData();
    }

    async initFriendshipWebSocket(storedUser) {
        this.webSocketManagerFriendships.connectWebSocket({}, () => {
            this.webSocketManagerFriendships.subscribeToFriendRequestFriendResponseChannel(storedUser, async (friendRequest) => {
                const friendRequestBody = JSON.parse(friendRequest.body);
                console.log("friendRequestBody: ", friendRequestBody)
                this.friendRequestNotification(true);
            });
            this.webSocketManagerFriendships.subscribeToFriendRequestUserResponseChannel(storedUser, async (friendRequest) => {
                const friendRequestBody = JSON.parse(friendRequest.body);
                friendRequestBody.statusCode === 400 ? toastr.error(friendRequestBody.message) : toastr.success(friendRequestBody.message);
            });
            this.webSocketManagerFriendships.subscribeToFriendRequestReplyNotificationUserResponseChannel(storedUser, async (friendRequest) => {
                const friendRequestBody = JSON.parse(friendRequest.body);
                toastr.success(friendRequestBody + " isteğinizi onayladı")
                this.friendRequestReplyNotificationBadge(true);
                this.fetchFriendRequestReplyData = await fetchFriendRequestReply();
                this.friendList = await fetchGetFriendList();
            });
            this.webSocketManagerFriendships.subscribeToFriendRequestReplyNotificationFriendResponseChannel(storedUser, async (friendRequest) => {
                const friendRequestBody = JSON.parse(friendRequest.body);
                toastr.success(friendRequestBody + " kişisini arkadaş eklediniz")
                this.friendList = await fetchGetFriendList();
            });
        },
            function (error) {
                console.error('WebSocket connection error: ' + error);
            });
    }

    // initChatWebSocket() {
    //     this.webSocketManagerChat.connectWebSocket({}, () => {

    //     }, function (error) {
    //         console.error('WebSocket connection error: ' + error);
    //     })
    // }


    async initialData() {
        this.friendList = await fetchGetFriendList();
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

        const friendListElement = document.querySelector(".friend-list");
        if (friendListElement) {
            friendListElement.addEventListener("click", () => {
                console.log("ElementDATA",this.friendList)
                this.handleInitialFriendList(this.friendList);
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
    async searchUsers() {
        console.log("asdfasdf")
        return await fetchGetFriendList();
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