// Chat.js
import AbstractView from "./AbstractView.js";
import { addFriendView } from "./AddFriend2.js";
import createContactList from "./Contacts.js";
import { createSettingsHtml } from "./Settings.js";
import { addContactModal } from "./AddContact.js";
import { ModalOptionsDTO } from "./showModal.js";
import { createIncomingFriendRequests } from "./IncomingFriendRequests.js";
import { createApprovedRequestHistory } from "./ApprovedRequestHistory.js";
import WebSocketManager from "../websocket.js";
import { hideElements } from './util.js';
import { handleChats, createChatBoxWithFirstMessage, lastMessageChange, updateMessageBox, isChatExist } from "./ChatBox.js";

export let webSocketManagerFriendships;
export let webSocketManagerChat;
export let chatInstance;

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
            lastMessage: 0,
            lastMessageTime: 0,
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
        this.visibleItemCount = 0;
        this.selectedChatElement = null;
        this.userId = '';
        this.chatList = [];
        this.contactList = [];
        this.fetchFriendRequestReplyData = [];

        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
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
           <span class></span>
    <span class></span>
    <div class="chat-container">

        <div class="xixxii4"></div>
        <div class="a1">
            <div class="a1-1">
                <span class="a1-1-1"></span>
            </div>
            <div class="a1-2">
                <span class="a1-2-1"></span>
            </div>
        </div>
        <div class="chats">
            <header class="chat-list-header">
                <div class="user-photo">
                    <div class="user-profile-photo" role="button" aria-label="profil fotoğrafı"
                        style="height: 40px; width: 40px; cursor: pointer;">
                        <img class="user-image" tabindex="0" src="/static/image/img.jpeg" alt="Varsayılan Fotoğraf"
                            id="profilePhoto" style="visibility: visible;" />
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
                        <div class="fa-solid fa-plus add-friendd option" tabindex="0" role="button" title="Arkadaş Ekle"
                            aria-label="Arkadaş Ekle">
                        </div>
                        <div class="fa-solid fa-user-plus friend-approval option" tabindex="0" role="button"
                            title="Gelen İstekler" aria-label="Gelen İstekler">
                            <div class="notification-badge" style="display: none;"></div>
                        </div>
                        <div class="fa-solid fa-bell friend-request-reply-notification option" tabindex="0"
                            role="button" title="Bildirimler" aria-label="Bildirimler">
                            <div class="notification-badge" style="display: none;"></div>
                        </div>
                        <div class="fa-solid fa-gear settings-btn option" tabindex="0" role="button" title="Seçenekler"
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
                                            preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px"
                                            enable-background="new 0 0 24 24">
                                            <title>back</title>
                                            <path fill="currentColor"
                                                d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
                                        </svg>
                                    </span>
                                </div>
                                <div class="_ai09">
                                    <span data-icon="search" class=""><svg viewBox="0 0 24 24" height="24" width="24"
                                            preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px"
                                            enable-background="new 0 0 24 24">
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
        <div class="message-box" id="chatWindow">
            <div class="start-message">Arkadaş Seçerek Sohbet Etmeye Başlayabilirsiniz.</div>
        </div>
        <div class="profile-box">
            <span class="profile-box-1"></span>
        </div>
    </div>
        `;
    }

    async init() {
        await this.initialData();
        this.webSocketManagerFriendships = new WebSocketManager('http://localhost:9030/ws', this.userId);;
        this.webSocketManagerChat = new WebSocketManager('http://localhost:9040/ws', this.userId);
        this.initFriendshipWebSocket();
        this.initChatWebSocket()
        handleChats();

        // window.addEventListener('beforeunload', this.handleBeforeUnload);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    async initFriendshipWebSocket() {
        this.webSocketManagerFriendships.connectWebSocket(() => {
            this.subscribeToFriendshipChannels();
        }, error => {
            console.error('Friendships WebSocket bağlantı hatası: ' + error);
        });
    }
    handleBeforeUnload(event) {
        this.webSocketManagerChat.notifyOnlineStatus(false);
    }

    handleVisibilityChange(event) {
        console.log("VISIBILITY CHANGE")
        if (document.visibilityState === 'hidden') {
            console.log("HIDDEN")
            this.webSocketManagerChat.notifyOnlineStatus(false);
        } else if (document.visibilityState === 'visible') {
            console.log("VISIBLE")
            this.webSocketManagerChat.notifyOnlineStatus(true);
        }
    }
    subscribeToFriendshipChannels() {
        const addContact = `/user/${this.userId}/queue/add-contact`;
        const addInvitation = `/user/${this.userId}/queue/add-invitation`;
        this.webSocketManagerFriendships.subscribeToChannel(addContact, async (addContactMessage) => {
            const newContact = JSON.parse(addContactMessage.body);
            console.log(newContact)
            let contactIdList = this.contactList.filter(contact => contact.userContactId);

            const indexToInsert = contactIdList.findIndex(contact => {
                return contact.userContactName.localeCompare(newContact.userContactName, undefined, { sensitivity: 'base' }) > 0;
            });
            if (indexToInsert === -1) {
                contactIdList.push(newContact);
            } else {
                contactIdList.splice(indexToInsert, 0, newContact);
            }
            this.contactList = [
                ...contactIdList,
                ...this.contactList.filter(contact => !contact.userContactId)
            ];
            console.log(this.contactList)
        });

        this.webSocketManagerFriendships.subscribeToChannel(addInvitation, async (addInvitationMessage) => {
            const newInvitation = JSON.parse(addInvitationMessage.body);
            console.log(newInvitation)
            let invitationIdList = this.contactList.filter(invitation => !invitation.userContactId);
            const indexToInsert = invitationIdList.findIndex(invitation => {
                return invitation.userContactName.localeCompare(newInvitation.userContactName, undefined, { sensitivity: 'base' }) > 0;
            });
            if (indexToInsert === -1) {
                invitationIdList.push(newInvitation);
            } else {
                invitationIdList.splice(indexToInsert, 0, newInvitation);
            }
            this.contactList = [
                ...this.contactList.filter(invitation => invitation.userContactId),
                ...invitationIdList
            ];
            console.log(this.contactList)
        });

    }

    initChatWebSocket() {
        this.webSocketManagerChat.connectWebSocket(() => {
            this.subscribeToChatChannels();
        }, function (error) {
            console.error('Chat WebSocket connection error: ' + error);
        })
    }

    subscribeToChatChannels() {
        const recipientMessageChannel = `/user/${this.userId}/queue/received-message`;
        const typingChannel = `/user/${this.userId}/queue/typing`;
        const stopTypingChannel = `/user/${this.userId}/queue/stop-typing`;


        this.webSocketManagerChat.subscribeToChannel(recipientMessageChannel, async (recipientMessage) => {
            const recipientJSON = JSON.parse(recipientMessage.body);
            console.log("RECIPENT > ", recipientJSON)
            if (!isChatExist(recipientJSON)) {
                console.log("IFFFFFFFFFFFFFFFFFF")
                console.log("RECIPENT > ", recipientJSON)
                await createChatBoxWithFirstMessage(recipientJSON)
            } else {
                console.log("RECIPENT > ", recipientJSON)
                updateMessageBox(recipientJSON)
                lastMessageChange(recipientJSON.chatRoomId, recipientJSON.messageContent)
            }
        })
        this.webSocketManagerChat.subscribeToChannel(typingChannel, (typingMessage) => {
            const status = JSON.parse(typingMessage.body);
            console.log("THIS USER ID > ", this.userId)
            const chatDOMS = [...document.querySelectorAll(".chat1")];
            console.log("STATUS > ", status)
            if (chatDOMS) {
                const chat = chatDOMS.find(el => el.chatData.id === status.chatRoomId);
                if (chat) {
                    console.log("CHAT > ", chat)
                    const lastMessageDOM = chat.querySelector(".message-span-span");
                    console.log("SPAN DOM > ", lastMessageDOM)
                    if (status.typing) {
                        lastMessageDOM.textContent = 'yaziyor...';
                    } else {
                        console.log("aaaaaaaaaaaaaaaa")
                        lastMessageDOM.textContent = chat.chatData.lastMessage;
                    }
                }
            }
        });
    }

    async initialData() {
        this.userId = await fetchGetUserId();
        console.log("InitialData userId: ", this.userId)
        this.contactList = await fetchGetContactList(this.userId);
        this.chatList = await fetchGetChatSummaries(this.userId);
        // for (let i = 1; i <= 81; i++) {
        //     const newData = JSON.parse(JSON.stringify(this.data)); // data nesnesinin derin bir kopyasını oluşturur
        //     newData.messages[0].messageContent = i;
        //     newData.id = i;
        //     newData.friendEmail = i;
        //     newData.lastMessage = i;
        //     newData.lastMessageTime = i;
        //     this.chatList.push(newData)
        // }
        console.log(this.chatList)
        console.log("UZUNLUK > ", this.chatList.length)
    }


    addEventListeners() {
        const chatListContentElement = document.querySelector(".chat-list-content")
        const addFriendButtonElement = document.querySelector(".add-friendd");
        const chatListHeaderElement = document.querySelector(".chat-list-header");
        const contactListButtonElement = document.querySelector(".friend-list-btn");
        const friendApprovalButtonElement = document.querySelector(".friend-approval");
        const chatSearchBarElement = document.querySelector('#chats-search-bar');
        const friendRequestReplyNotificationElement = document.querySelector(".friend-request-reply-notification");
        const settingsBtnElement = document.querySelector(".settings-btn");
        const box = document.querySelector(".box")

        console.log("ABCDE")

        // window.addEventListener('resize', () => { this.handleReSize() });

        if (addFriendButtonElement) {
            addFriendButtonElement.addEventListener("click", () => {
                // hideElements(chatListHeaderElement, chatListContentElement, chatSearchBarElement)
                // addFriendView();
                const modalDTO = new ModalOptionsDTO({
                    title: 'Kişi ekle',
                    buttonText: 'Ekle',
                    showBorders: false,
                })

                addContactModal(modalDTO);
            });
        }

        if (contactListButtonElement) {
            contactListButtonElement.addEventListener("click", () => {
                this.handleInitialContactList();
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

        if (settingsBtnElement) {
            settingsBtnElement.addEventListener("click", () => {
                createSettingsHtml();
            })
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

    handleInitialContactList() {
        createContactList(this.contactList, this.chatList/**, this.chatElements*/);
    }

    // handleReSize() {
    //     const chatListContentElement = document.querySelector(".chat-list-content");
    //     const boxElement = document.querySelector(".box");
    //     const visibleItemCount = Math.ceil(boxElement.clientHeight / 72) + 7;
    //     chatListContentElement.style.height = this.chatList.length * 72 + "px";

    //     const currentItemElements = document.querySelectorAll('.chat1');
    //     const currentItemCount = currentItemElements.length;
    //     console.log("currentItemCount: ", currentItemCount, " visibleItemCount: " + visibleItemCount);


    //         for (let i = currentItemCount; i < visibleItemCount; i++) {
    //             const chatDOM = this.createChatElement(this.chatList[i], i);
    //             this.chatElements.push(chatDOM);
    //             chatListContentElement.appendChild(chatDOM.chatElementDOM);
    //             this.addChatEventListeners(chatDOM.chatElementDOM);
    //         }

    //         for (let i = currentItemCount - 1; i >= visibleItemCount; i--) {
    //             chatListContentElement.removeChild(currentItemElements[i]);
    //             this.removeChatEventListeners(currentItemElements[i]);

    //     }

    //     // Update positions and content of visible items
    //     this.updateVisibleItems();
    // }

    destroy() {

    }

}


const getContactList = 'http://localhost:8080/api/v1/contacts/get-contact-list';
const fetchGetContactList = async (userId) => {
    try {
        const response = await fetch(`${getContactList}?userId=${userId}`, {
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
        console.log("fetchContactList: ", result)
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};


const getChatSummariesUrl = 'http://localhost:8080/api/v1/chat/chat-summaries/';

const fetchGetChatSummaries = async (userId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${getChatSummariesUrl}${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

const getLatestMessagesUrl = 'http://localhost:8080/api/v1/chat/messages/latest';
const fetchGetLatestMessages = async (chatRoomId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${getLatestMessagesUrl}?chatRoomId=${chatRoomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const result = await response.json();
        console.log(result);
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



const fetchChatBlockUrl = 'http://localhost:8080/api/v1/chat/chat-block';
const fetchChatBlock = async (chatSummaryDTO) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(fetchChatBlockUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(chatSummaryDTO),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toastr.error(errorData.message);
            throw new Error(errorData.message);
        }

        const result = await response.json();
        toastr.success(result.message);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

const fetchChatUnblockUrl = 'http://localhost:8080/api/v1/chat/chat-unblock';
const fetchChatUnblock = async (chatSummaryDTO) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(fetchChatUnblockUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(chatSummaryDTO),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toastr.error(errorData.message);
            throw new Error(errorData.message);
        }

        const result = await response.json();
        toastr.success(result.message);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};


export class UserSettingsDTO {
    constructor({
        friendId = '',
        userId = '',
        id = '',
        userChatSettings = {},
        friendEmail = '',
    } = {}) {
        this.userChatSettings = userChatSettings;
        this.userId = userId;
        this.id = id;
        this.friendEmail = friendEmail;
        this.friendId = friendId;
    }
}

