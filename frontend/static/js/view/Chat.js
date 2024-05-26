// Chat.js
import AbstractView from "./AbstractView.js";
import { addFriendView } from "./AddFriend2.js";
import createFriendList from "./Friends.js";
import { createIncomingFriendRequests } from "./IncomingFriendRequests.js";
import { createApprovedRequestHistory } from "./ApprovedRequestHistory.js";
import { createMessageBox, appendMessage } from "./MessageBox.js";
import WebSocketManager from "../websocket.js";
import { hideElements } from './util.js'

export let webSocketManagerFriendships;
export let webSocketManagerChat;
export let chatInstance;
webSocketManagerFriendships = new WebSocketManager('http://localhost:9030/ws');
webSocketManagerChat = new WebSocketManager('http://localhost:9040/ws');

export default class Chat extends AbstractView {
    constructor(params) {
        super(params);
        chatInstance = this;
        this.setTitle("Chat");/* 
        this.renderChat()
        this.addEventListeners() */
        this.data = {
            friendEmail: "asdfasdfasdf@wwwwww.com",
            friendId: "03e49ab6-81b0-4609-84e1-5ceadc4c29b7",
            id: 0,
            image: null,
            messages: [
                {
                    chatRoomId: "7c6f47eb-dad2-44b3-a036-ffbf92343ae2_03e49ab6-81b0-4609-84e1-5ceadc4c29b7",
                    fullDateTime: "2024-05-08T22:22:22.968Z",
                    id: "663bfb1ebb15cc42647f6bce",
                    messageContent: "1",
                    recipientId: "03e49ab6-81b0-4609-84e1-5ceadc4c29b7",
                    seen: false,
                    senderId: "7c6f47eb-dad2-44b3-a036-ffbf92343ae2"
                }
            ],
            userId: "7c6f47eb-dad2-44b3-a036-ffbf92343ae2"
        };
        this.userId = '';
        this.chatList = [];
        this.chatElements = [];
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
        <div class="chat-box" id="chatWindow">
            <div class="start-message">Arkadaş Seçerek Sohbet Etmeye Başlayabilirsiniz.</div>
        </div>
    </div>`
    document.querySelector("#content").innerHTML = chatHtml;
    } */

    async getHtml() {
        return `
        <div class="chat-container">
        <div class="box">
            <div class="xixxii4"></div>
            <div class="left-side">
                <header class="chat-list-header">
                    <div class="user-photo">
                        <div class="user-profile-photo" role="button" aria-label="profil fotoğrafı"
                            style="height: 40px; width: 40px; cursor: pointer;">
                            <img class="user-image" tabindex="0" src="/static/image/img.jpeg"
                                alt="Varsayılan Fotoğraf" id="profilePhoto" style="visibility: visible;" />
                        </div>
                    </div>
                    <div class="options-div">
                        <div class="options">
                            <div class="friend-list-btn option" tabindex="0" role="button" title="Yeni Sohbet Başlat"
                                aria-label="Yeni Sohbet Başlat">
                                <span class="friend-list-icon option material-symbols-outlined">
                                    chat_add_on
                                </span>
                            </div>
                            <div class="fa-solid fa-plus add-friendd option" tabindex="0" role="button"
                                title="Arkadaş Ekle" aria-label="Arkadaş Ekle">
                            </div>
                            <div class="fa-solid fa-user-plus friend-approval option" tabindex="0" role="button"
                                title="Gelen İstekler" aria-label="Gelen İstekler">
                                <div class="notification-badge" style="display: none;"></div>
                            </div>
                            <div class="fa-solid fa-bell friend-request-reply-notification option" tabindex="0"
                                role="button" title="Bildirimler" aria-label="Bildirimler">
                                <div class="notification-badge" style="display: none;"></div>
                            </div>
                            <div class="fa-solid fa-gear settings option" tabindex="0" role="button" title="Seçenekler"
                                aria-label="Seçenekler"></div>
                        </div>
                    </div>
                </header>

                <div class="chat-content side">
                    <div tabindex="-1" class="_ak9t">
                        <div class="chats-search-bar search-bar" id="chats-search-bar">
                            <div></div>
                            <div class="_ai04">
                                <button class="_ai0b" aria-label="Aratın veya yeni sohbet başlatın" tabindex="-1">
                                    <div class="_ah_x">
                                        <span data-icon="back" class>
                                            <svg viewBox="0 0 24 24" height="24" width="24"
                                                preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px"
                                                y="0px" enable-background="new 0 0 24 24">
                                                <title>back</title>
                                                <path fill="currentColor"
                                                    d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <div class="_ai09">
                                        <span data-icon="search" class=""><svg viewBox="0 0 24 24" height="24"
                                                width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1"
                                                x="0px" y="0px" enable-background="new 0 0 24 24">
                                                <title>search</title>
                                                <path fill="currentColor"
                                                    d="M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z">
                                                </path>
                                            </svg></span>
                                    </div>
                                </button>
                                <span></span>
                                <div class="_ah_-">Ara</div>
                                <div class="_ai05">
                                    <div class="_x1n2onr6">
                                        <div class="x1hx0egp" contenteditable="true" role="textbox"
                                            title="Arama metni giriş alanı" tabindex="3"
                                            style="min-height: 1.47em; user-select: text; white-space: pre-wrap; word-break: break-word;">
                                            <p class="selectable-text">
                                                <br>
                                            </p>
                                        </div>
                                        <div class="x1016tqk"></div>
                                    </div>
                                </div>


                            </div>
                            <button class="xdj66r" data-tab="4" aria-label="Okunmamış sohbetler filtresi"
                                aria-pressed="false" title="Okunmamış sohbetler filtresi">
                                <div class="x1c4vz4f">
                                    <span data-icon="filter" class=""><svg viewBox="0 0 24 24" height="20" width="20"
                                            preserveAspectRatio="xMidYMid meet" class="" fill="none">
                                            <title>filter</title>
                                            <path
                                                d="M11 18C10.7167 18 10.4792 17.9042 10.2875 17.7125C10.0958 17.5208 10 17.2833 10 17C10 16.7167 10.0958 16.4792 10.2875 16.2875C10.4792 16.0958 10.7167 16 11 16H13C13.2833 16 13.5208 16.0958 13.7125 16.2875C13.9042 16.4792 14 16.7167 14 17C14 17.2833 13.9042 17.5208 13.7125 17.7125C13.5208 17.9042 13.2833 18 13 18H11ZM7 13C6.71667 13 6.47917 12.9042 6.2875 12.7125C6.09583 12.5208 6 12.2833 6 12C6 11.7167 6.09583 11.4792 6.2875 11.2875C6.47917 11.0958 6.71667 11 7 11H17C17.2833 11 17.5208 11.0958 17.7125 11.2875C17.9042 11.4792 18 11.7167 18 12C18 12.2833 17.9042 12.5208 17.7125 12.7125C17.5208 12.9042 17.2833 13 17 13H7ZM4 8C3.71667 8 3.47917 7.90417 3.2875 7.7125C3.09583 7.52083 3 7.28333 3 7C3 6.71667 3.09583 6.47917 3.2875 6.2875C3.47917 6.09583 3.71667 6 4 6H20C20.2833 6 20.5208 6.09583 20.7125 6.2875C20.9042 6.47917 21 6.71667 21 7C21 7.28333 20.9042 7.52083 20.7125 7.7125C20.5208 7.90417 20.2833 8 20 8H4Z"
                                                fill="currentColor"></path>
                                        </svg></span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <span class="x78zum5"></span>
                    <div class="pane-side" id="pane-side">
                        <button data-tab="4" class="archiv-button" aria-label="Arşivlenmiş">
                            <div class="button1">
                                <div class="div1">
                                    <div class="div1-1">
                                        <div class="div1-1-1">
                                            <span data-icon="archived" class>
                                                <svg viewBox="0 0 20 20" height="20" width="20"
                                                    preserveAspectRatio="xMidYMid" class fill="none">
                                                    <title>archived</title>
                                                    <path
                                                        d="M18.54 3.23L17.15 1.55C16.88 1.21 16.47 1 16 1H4C3.53 1 3.12 1.21 2.84 1.55L1.46 3.23C1.17 3.57 1 4.02 1 4.5V17C1 18.1 1.9 19 3 19H17C18.1 19 19 18.1 19 17V4.5C19 4.02 18.83 3.57 18.54 3.23ZM4.24 3H15.76L16.57 3.97H3.44L4.24 3ZM3 17V6H17V17H3ZM11.45 8H8.55V11H6L10 15L14 11H11.45V8Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="div2">
                                    <div class="div2-2" role="group">
                                        <div class="div2-2-1">Arşivlenmiş</div>
                                    </div>
                                </div>
                                <div class="div3">
                                    <div class="div3-1">
                                        <span class="div3-1-1" aria-label="2 okunmamış mesaj">2</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                        <div class="xh8yej33">
                            <div class="x9f6199"></div>
                        </div>
                        <div tabindex="-1" class data-tab="4">
                            <div tabindex="-1" style="pointer-events: auto;">
                                <div class="chat-list-content" role="grid">
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            </div>
            <div class="chat-box" id="chatWindow">
                <div class="start-message">Arkadaş Seçerek Sohbet Etmeye Başlayabilirsiniz.</div>
            </div>
        </div>
    </div>
        `;
    }

    async init() {
        await this.initialData();
        this.initFriendshipWebSocket();
        this.initChatWebSocket()
        this.handleChats();
    }

    async initFriendshipWebSocket() {
        this.webSocketManagerFriendships.connectWebSocket(() => {
            this.subscribeToFriendshipChannels();
        }, error => {
            console.error('Friendships WebSocket bağlantı hatası: ' + error);
        });
    }

    subscribeToFriendshipChannels() {

        const friendResponseChannel = `/user/${this.userId}/queue/friend-request-friend-response`;
        const userChannel = `/user/${this.userId}/queue/friend-request-user-response`;
        const notificationChannel = `/user/${this.userId}/queue/friend-request-reply-notification-user-response`;
        const notificationFriendChannel = `/user/${this.userId}/queue/friend-request-reply-notification-friend-response`;

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
    }

    initChatWebSocket() {
        this.webSocketManagerChat.connectWebSocket({}, () => {
            this.subscribeToChatChannels();
        }, function (error) {
            console.error('Chat WebSocket connection error: ' + error);
        })
    }

    subscribeToChatChannels() {
        const recipientMessageChannel = `/user/${this.userId}/queue/received-message`

        this.webSocketManagerChat.subscribeToChannel(recipientMessageChannel, async (recipientMessage) => {
            const recipientJSON = JSON.parse(recipientMessage.body);
            if (!this.isChatExist(recipientJSON)) {
                console.log("IFFFFFFFFFFFFFFFFFF")
                await this.createChat(recipientJSON)
            } else {
                this.updateMessageBox(recipientJSON)
                this.lastMessageChange(recipientJSON.chatRoomId, recipientJSON.messageContent)
            }

        })
    }
    async createChat(recipientJSON) {
        const user = await fetchGetUserById(recipientJSON.senderId);
        console.log(user.id)
        console.log(recipientJSON.senderId)
        const chat = {
            friendImage: user.image,
            friendId: recipientJSON.senderId,
            friendEmail: user.email,
            image: user.image,
            id: recipientJSON.chatRoomId,
            messages: [recipientJSON]
        };
        this.chatList.push(chat)
        this.createChatElement(chat);
    }
    updateMessageBox(recipientJSON) {
        for (let i = 0; i < this.chatList.length; i++) {
            if (this.chatList[i].id === recipientJSON.chatRoomId) {
                appendMessage(recipientJSON, this.userId);
                console.log("CHAT ITEM 1> ", this.chatList[i])
                this.chatList[i].messages.push(recipientJSON)
                console.log("CHAT ITEM 2> ", this.chatList[i])
                break;
            }
        }
    }

    isChatExist(recipientJSON) {
        if (this.chatList && this.chatList.some(chat => chat.id === recipientJSON.chatRoomId)) {
            console.log("TRUEEEEEEEEEEEEEEEEEEEEEEEEE")
            return true;
        }
        console.log("FALSEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        return false;
    }

    lastMessageChange(chatRoomId, lastMessage) {
        this.chatElements.forEach(element => {
            const chatElementDOM = element.chatElementDOM;
            const lastMessageElement = chatElementDOM.querySelector('.last-message');
            element.chatId === chatRoomId ? lastMessageElement.textContent = lastMessage : 0;
        });
    }

    async initialData() {
        this.userId = await fetchGetUserId();
        console.log("InitialData userId: ", this.userId)
        this.friendList = await fetchGetFriendList();
        // this.chatList = await fetchGetChatList(this.userId);
        for (let i = 1; i <= 81; i++) {
            const newData = JSON.parse(JSON.stringify(this.data)); // data nesnesinin derin bir kopyasını oluşturur
            newData.messages[0].messageContent = i;
            newData.id = i;
            newData.friendEmail = i;
            this.chatList.push(newData)
        }
        console.log("UZUNLUK > ", this.chatList.length)
    }


    addEventListeners() {
        const chatListContentElement = document.querySelector(".chat-list-content")
        const addFriendButtonElement = document.querySelector(".add-friendd");
        const chatListHeaderElement = document.querySelector(".chat-list-header");
        const friendListButtonElement = document.querySelector(".friend-list-btn");
        const friendApprovalButtonElement = document.querySelector(".friend-approval");
        const chatSearchBarElement = document.querySelector('#chats-search-bar');
        const friendRequestReplyNotificationElement = document.querySelector(".friend-request-reply-notification");
        const box = document.querySelector(".box")
        const paneSideElement = document.querySelector("#pane-side")

        // window.addEventListener('resize', function() {
        //     const box = document.querySelector(".box")
        //     console.log("YUKSEKLIK > ", box.clientHeight)
        //     if (box.clientHeight <= 512) {

        //     } else {

        //     }
        // });

        if (addFriendButtonElement) {
            addFriendButtonElement.addEventListener("click", () => {
                hideElements(chatListHeaderElement, chatListContentElement, chatSearchBarElement)
                addFriendView();
            });
        }

        if (friendListButtonElement) {
            friendListButtonElement.addEventListener("click", () => {
                hideElements(chatListHeaderElement, chatListContentElement, chatSearchBarElement)
                this.handleInitialFriendList();
            });
        }

        if (friendApprovalButtonElement) {
            friendApprovalButtonElement.addEventListener("click",
                () => {
                    hideElements(chatListHeaderElement, chatListContentElement, chatSearchBarElement)
                    createIncomingFriendRequests()
                    this.friendRequestNotification(false);
                });
        }

        if (friendRequestReplyNotificationElement) {
            friendRequestReplyNotificationElement.addEventListener("click", () => {
                hideElements(chatListHeaderElement, chatListContentElement, chatSearchBarElement)
                createApprovedRequestHistory(this.fetchFriendRequestReplyData)
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

    handleInitialFriendList() {
        createFriendList(this.friendList, this.userId, this.chatList, this.chatElements);
    }

    handleChats() {
        const chatListContentElement = document.querySelector(".chat-list-content");
        const boxElement = document.querySelector(".box");
        const visibleItemCount = Math.ceil(boxElement.clientHeight / 72) + 7;
        chatListContentElement.style.height = this.chatList.length * 72 + "px";

        let start = 0;
        let end = visibleItemCount;

        for (let i = 0; i < visibleItemCount; i++) {
            const chatDOM = this.createChatElement(this.chatList[i], i);
            this.chatElements.push(chatDOM);
            chatListContentElement.appendChild(chatDOM.chatElementDOM);
            this.addChatEventListeners(chatDOM.chatElementDOM);
            console.log("AAAAAAAAAAAAAAAAA");
        }

        this.virtualScrolling(visibleItemCount, start, end);
    }

    virtualScrolling(visibleItemCount, start, end) {
        const paneSideElement = document.querySelector("#pane-side");
        paneSideElement.addEventListener("scroll", () => {
            const scrollTop = paneSideElement.scrollTop;
            const newStart = Math.floor(scrollTop / 72);
            const newEnd = newStart + visibleItemCount;
            // console.log("visibleItemCount: ", visibleItemCount, " newStart: ", newStart, " newEnd: ", newEnd, " scrollTop: ", scrollTop);
            if (newStart !== start || newEnd !== end) {
                start = newStart;
                end = newEnd;
                this.updateItems(start, end);
            }
        });
    }

    updateItems(newStart, newEnd) {
        const itemsToUpdate = Array.from(document.querySelectorAll('.chat1'))
            .filter(item => {
                const translateY = parseInt(item.style.transform.match(/translateY\((.*)px\)/)[1]);
                const index = translateY / 72;
                return (index < newStart || index >= newEnd);
            });
        itemsToUpdate.forEach((item, idx) => {
            const translateY = parseInt(item.style.transform.match(/translateY\((.*)px\)/)[1]);
            const index = translateY / 72;
            const newIndex = (index < newStart) ? (newEnd - 1 - idx) : (newStart + idx);
            const chat = this.chatList[newIndex];
            if (chat) {
                const time = chat.messages[chat.messages.length - 1].fullDateTime;
                const date = new Date(time);
                const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const nameSpan = item.querySelector(".name-span");
                const timeSpan = item.querySelector(".time");
                const messageSpan = item.querySelector(".message-span-span");

                nameSpan.textContent = chat.friendEmail;
                timeSpan.textContent = formattedTime;
                messageSpan.textContent = chat.messages[chat.messages.length - 1].messageContent;

                item.style.transform = `translateY(${newIndex * 72}px)`;
                item.style.zIndex = newIndex;
                this.removeChatEventListeners(item);
                this.addChatEventListeners(item);
            }
        });
    }



    createChatElement(chat, index) {
        const time = chat.messages[chat.messages.length - 1].fullDateTime;
        const date = new Date(time);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const chatElementDOM = document.createElement("div");
        chatElementDOM.classList.add("chat1");
        chatElementDOM.setAttribute("role", "listitem");
        chatElementDOM.style.transition = "none 0s ease 0s";
        chatElementDOM.style.height = "72px";
        chatElementDOM.style.transform = `translateY(${index * 72}px)`;
        chatElementDOM.style.zIndex = index;
        chatElementDOM.chatData = chat;
        chatElementDOM.innerHTML = `
            <div class="chat2">
                <div tabindex="-1" class aria-selected="false" role="row">
                    <div class="chat">
                        <div class="chat-image">
                            <div class="chat-left-image">
                                <div>
                                    <div class="image" style="height: 49px; width: 49px;">
                                        <img src="static/image/img.jpeg" alt="" draggable="false" class="user-image" tabindex="-1" style="visibility: visible;">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chat-info">
                            <div class="chat-name-and-last-message-time">
                                <div class="chat-name">
                                    <div class="name">
                                        <span dir="auto" title="${chat.friendEmail}" aria-label="" class="name-span" style="min-height: 0px;">${chat.friendEmail}</span>
                                    </div>
                                </div>
                                <div class="time">${formattedTime}</div>
                            </div>
                            <div class="last-message chat-options">
                                <div class="message">
                                    <span class="message-span" title="">
                                        <span dir="ltr" aria-label class="message-span-span" style="min-height: 0px;">${chat.messages[chat.messages.length - 1].messageContent}</span>
                                    </span>
                                </div>
                                <div class="chat-options"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return { chatElementDOM: chatElementDOM, chatId: chat.id };
    }

    addChatEventListeners(chatElementDOM) {
        chatElementDOM.addEventListener('click', this.handleChatClick);
    }

    removeChatEventListeners(chatElementDOM) {
        chatElementDOM.removeEventListener('click', this.handleChatClick);
    }

    handleChatClick(event) {
        const chatElementDOM = event.currentTarget;
        const chatData = chatElementDOM.chatData;

        const innerDiv = chatElementDOM.querySelector('.chat2 > div');
        const ariaSelectedValue = innerDiv.getAttribute('aria-selected');
        if (ariaSelectedValue === 'false') {
            chatElementDOM.querySelector(".chat").classList.add('selected-chat');
            console.log('Chat clicked:', chatElementDOM, chatData);
            innerDiv.setAttribute('aria-selected', 'true');
        }


    }

    // pushChatElements(messageContent) {
    //     this.chatElements.push()

    // }

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
        console.log(response)
        const result = await response.json();
        console.log("fetchFriendList: ", result)
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

const getChatList = 'http://localhost:8080/api/v1/chat/get-chat-list';
const fetchGetChatList = async (userId) => {
    try {
        const response = await fetch(getChatList, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ userId: userId }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        console.log(result)
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

const getUserByIdUrl = 'http://localhost:8080/api/v1/user/get-user-by-id';
async function fetchGetUserById(userId) {
    try {
        const response = await fetch(getUserByIdUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(userId),
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}


