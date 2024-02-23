// Chat.js
import AbstractView from "./AbstractView.js";
import { addFriendView } from "./AddFriend2.js";
import { friendListView } from "./FriendList.js";
import { friendApprovalView } from "./friendApproval.js";
import { friendRequestReplyNotificationView } from "./FriendRequestReplyNotificationView.js";
import WebSocketManager from "../websocket.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Chat");
        console.log("asdfasdfasdfasdfasdf")
        
        this.abc=5;
        this.Deneme();
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
    async addEventListeners() {
        console.log("55")
        this.Deneme();
        friendListData = await fetchSearchUsers();
        fetchFriendRequestReplyData = await fetchFriendRequestReply();
        const storedUser = localStorage.getItem('userId');

        webSocketManagerFriendships = new WebSocketManager('http://127.0.0.1:9030/ws');
        webSocketManagerChat = new WebSocketManager('http://127.0.0.1:9040/ws');

        webSocketManagerFriendships.connectWebSocket({}, function () {
            webSocketManagerFriendships.subscribeToFriendRequestFriendResponseChannel(storedUser, async function (friendRequest) {
                const friendRequestBody = JSON.parse(friendRequest.body);
                console.log("friendRequestBody: ", friendRequestBody)
                friendRequestNotification(true);
            });
            webSocketManagerFriendships.subscribeToFriendRequestUserResponseChannel(storedUser, async function (friendRequest) {
                const friendRequestBody = JSON.parse(friendRequest.body);
                friendRequestBody.statusCode === 400 ? toastr.error(friendRequestBody.message) : toastr.success(friendRequestBody.message);
            });
            webSocketManagerFriendships.subscribeToFriendRequestReplyNotificationUserResponseChannel(storedUser, async function (friendRequest) {
                const friendRequestBody = JSON.parse(friendRequest.body);
                toastr.success(friendRequestBody + " isteğinizi onayladı")
                friendRequestReplyNotificationBadge(true);
                fetchFriendRequestReplyData = await fetchFriendRequestReply();
                friendListData = await fetchSearchUsers();
            });
            webSocketManagerFriendships.subscribeToFriendRequestReplyNotificationFriendResponseChannel(storedUser, async function (friendRequest) {
                const friendRequestBody = JSON.parse(friendRequest.body);
                toastr.success(friendRequestBody + " kişisini arkadaş eklediniz")
                friendListData = await fetchSearchUsers();
            });
        },
            function (error) {
                console.error('WebSocket connection error: ' + error);
            });

        webSocketManagerChat.connectWebSocket({}, function () {

        }, function (error) {
            console.error('WebSocket connection error: ' + error);
        })

        const searchButton = document.querySelector(".search-button");
        if (searchButton) {
            searchButton.addEventListener("click", deneme1);
        }

        const addFriendButton = document.querySelector(".add-friendd");
        if (addFriendButton) {
            addFriendButton.addEventListener("click", function () {
                addFriendView(webSocketManagerFriendships)
            });
        }

        const friendList = document.querySelector(".friend-list");
        if (friendList) {
            friendList.addEventListener("click", () => {
                friendListView(friendListData);
            });
        }

        const friendApprovalBtn = document.querySelector(".friend-approval");
        if (friendApprovalBtn) {
            friendApprovalBtn.addEventListener("click",
                function () {
                    friendApprovalView(webSocketManagerFriendships)
                    friendRequestNotification(false);
                });
        }
        const friendRequestReplyNotification = document.querySelector(".friend-request-reply-notification");
        if (friendRequestReplyNotification) {
            friendRequestReplyNotification.addEventListener("click", function () {
                friendRequestReplyNotificationView(fetchFriendRequestReplyData)
                friendRequestReplyNotificationBadge(false)
            });
        }

    }
    Deneme() {
        console.log("DENEME")
        console.log(this.abc)
        this.abc = 10;
        console.log(this.abc)
        deneme1()
        this.Deneme2()
    }
    Deneme2(){
        console.log("deneme2")
    }
}

let friendListData;
let fetchFriendRequestReplyData;

let webSocketManagerFriendships;
let webSocketManagerChat;



function friendRequestNotification(showBadge) {
    const notificationBadge = document.querySelector('.friend-approval .notification-badge');
    if (notificationBadge) {
        notificationBadge.style.display = showBadge ? 'block' : 'none';
    }
}

function friendRequestReplyNotificationBadge(showBadge) {
    const replyNotificationBadge = document.querySelector('.friend-request-reply-notification .notification-badge');
    if (replyNotificationBadge) {
        replyNotificationBadge.style.display = showBadge ? 'block' : 'none';
    }
}


const getFriendList = 'http://localhost:8080/api/v1/friendships/get-friend-list';
const fetchSearchUsers = async () => {
    try {
        const response = await fetch(getFriendList, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('access_token'),
            },
            body: JSON.stringify({ token: localStorage.getItem('access_token') }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        if (result) {
            friendListData = result;
            Deneme();

        } else {
            toastr.error('Kullanıcı arama başarısız');
        }
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};
function deneme1(){
    console.log("deneme1")
}

async function fetchFriendRequestReply() {
    const requestBody = {
        userId: localStorage.getItem("userId")
    };
    try {
        const response = await fetch("http://localhost:8080/api/v1/friendships/friend-request-reply-notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': localStorage.getItem('access_token'),
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}


export { webSocketManagerFriendships, webSocketManagerChat}