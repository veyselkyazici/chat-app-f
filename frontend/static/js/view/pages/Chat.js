// Chat.js
import AbstractView from "../AbstractView.js";
import createContactList from "../components/Contacts.js";
import { createSettingsHtml } from "../components/Settings.js";
import { addContactModal } from "../components/AddContact.js";
import { ModalOptionsDTO } from "../utils/showModal.js";
import { createIncomingFriendRequests } from "../IncomingFriendRequests.js";
import { createApprovedRequestHistory } from "../ApprovedRequestHistory.js";
import WebSocketManager from "../../websocket.js";
import { hideElements, createElement, createSvgElement, createProfileImage } from '../utils/util.js';
import { handleChats, createChatBoxWithFirstMessage, lastMessageChange, updateChatBox } from "../components/ChatBox.js";
import { isOnlineStatus, isMessageBoxDomExists, renderMessage, messageBoxElementMessagesReadTick, createMessageDeliveredTickElement, onlineInfo } from "../components/MessageBox.js";
import { navigateTo } from "../../index.js";
import { fetchGetUserWithUserKeyByAuthId } from "../services/userService.js"
import { fetchGetContactList } from "../services/contactsService.js"
import { fetchGetChatSummaries } from "../services/chatService.js"
import { userUpdateModal } from "../components/UpdateUserProfile.js"
import { importPublicKey, base64ToUint8Array, getUserKey, setUserKey, decryptMessage, setSessionKey, decryptWithSessionKey } from "../utils/e2ee.js";

import { ChatSummaryDTO } from '../dtos/chat/response/ChatSummaryDTO.js'
import { FeignClientUserProfileResponseDTO } from "../dtos/contact/response/FeignClientUserProfileResponseDTO.js";

export let webSocketManagerContacts;
export let webSocketManagerChat;
export let chatInstance;

export default class Chat extends AbstractView {
    constructor(params) {
        super(params);
        chatInstance = this;
        this.setTitle("Chat");
        this.visibleItemCount = 0;
        this.selectedChat = null;
        this.user = {};
        this.chatList = [];
        this.contactList = [];
        this.fetchFriendRequestReplyData = [];
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    async getHtml() {
        return `
           <span class></span>
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
<div class="user-profile-photo"  style="height: 49px; width: 49px;" role="button"><div class="svg-div"><span class="" aria-hidden="true" data-icon="default-user"><svg class="svg-element" viewBox="0 0 212 212" height="212" width="212" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 212 212"><title>default-user</title><path fill="#DFE5E7" class="background" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g><path fill="#FFFFFF" class="primary" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" class="primary" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path></g></svg></span></div></div>
                </div>
                <div class="options-div">
                    <div class="options">
                        <div class="friend-list-btn option" tabindex="0" role="button" title="Yeni Sohbet Başlat"
                            aria-label="Yeni Sohbet Başlat">
                            <span class="friend-list-icon option material-symbols-outlined">
                                chat_add_on
                            </span>
                        </div>
                        <div class="add-friendd option" tabindex="0" role="button" title="Arkadaş Ekle"
                            aria-label="Arkadaş Ekle"><i class="fa-solid fa-plus"></i>
                        </div>
                        <div class="friend-approval option" tabindex="0" role="button"
                            title="Gelen İstekler" aria-label="Gelen İstekler"> <i class="fa-solid fa-user-plus"></i>
                            <div class="notification-badge" style="display: none;"></div>
                        </div>
                        <div class="friend-request-reply-notification option" tabindex="0"
                            role="button" title="Bildirimler" aria-label="Bildirimler"> <i class="fa-solid fa-bell"></i>
                            <div class="notification-badge" style="display: none;"></div>
                        </div>
                        <div class="settings-btn option" tabindex="0" role="button" title="Seçenekler"
                            aria-label="Seçenekler"> <i class="fa-solid fa-gear"></i></div>
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
                    </div>
                </div>
                <span class="x78zum5"></span>
                <div class="pane-side" id="pane-side">
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
        <div class="contact-information profile">
            <span class="contact-information-span"></span>
        </div>
    </div>
        `;
    }

    async init() {
        await this.addEventListeners();
        await this.initialData();
        this.webSocketManagerContacts = new WebSocketManager('http://localhost:9030/ws', this.user.id);
        this.webSocketManagerChat = new WebSocketManager('http://localhost:9040/ws', this.user.id);
        this.initContactsWebSocket();
        this.initChatWebSocket();
        window.addEventListener('beforeunload', (event) => this.handleBeforeUnload(event));
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    async initContactsWebSocket() {
        this.webSocketManagerContacts.connectWebSocket(() => {
            this.subscribeToFriendshipChannels();
        }, error => {
            console.error('Friendships WebSocket bağlantı hatası: ' + error);
        });
    }
    handleBeforeUnload(event) {
        const messageBoxElement = document.querySelector('.message-box1');
        if (messageBoxElement) {
            const textArea = messageBoxElement.querySelector('.message-box1-7-1-1-1-2-1-1-1');
            const messageBox = messageBoxElement.data;
            if (textArea.textContent.length > 0) {
                chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: chatInstance.user.id, chatRoomId: messageBox.id, typing: false, friendId: messageBox.contactsDTO.userProfileResponseDTO.id });
                typingStatus.isTyping = false;
            }
        }

        if (this.webSocketManagerChat) {
            this.webSocketManagerChat.notifyOnlineStatus(false);
            this.webSocketManagerChat.disconnectWebSocket();
        }
        if (this.webSocketManagerContacts) {
            this.webSocketManagerContacts.disconnectWebSocket();
        }
        // event.preventDefault();
        // event.returnValue = '';
    }

    handleVisibilityChange(event) {
        if (document.visibilityState === 'hidden') {
            this.webSocketManagerChat.notifyOnlineStatus(false);
        } else if (document.visibilityState === 'visible') {
            this.webSocketManagerChat.notifyOnlineStatus(true);
        }
    }
    subscribeToFriendshipChannels() {
        const addContact = `/user/${this.user.id}/queue/add-contact`;
        const addContactUser = `/user/${this.user.id}/queue/add-contact-user`;
        const addInvitation = `/user/${this.user.id}/queue/add-invitation`;
        const updatePrivacy = `/user/${this.user.id}/queue/updated-privacy-response`;
        const updatedProfilePhoto = `/user/${this.user.id}/queue/updated-profile-photo-message`;

        this.webSocketManagerContacts.subscribeToChannel(addContact, async (addContactMessage) => {
            const newContact = JSON.parse(addContactMessage.body);
            const chatElements = [...document.querySelectorAll('.chat1')];
            const chatElement = chatElements.find(chat => chat.chatData.userProfileResponseDTO.id === newContact.userProfileResponseDTO.id);
            if (chatElement) {
                const nameSpan = chatElement.querySelector('.name-span');
                nameSpan.textContent = newContact.contactsDTO.userContactName;
                chatElement.chatData.contactsDTO.userContactName = newContact.contactsDTO.userContactName;
                const findChat = chatInstance.chatList.find(chat => chat.userProfileResponseDTO.id === newContact.userProfileResponseDTO.id)
                if (findChat) {
                    findChat.contactsDTO.userHasAddedRelatedUser = true;
                    findChat.contactsDTO.userContactName = newContact.contactsDTO.userContactName;
                }
            }

            let contactIdList = this.contactList.filter(contact => contact.id);

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
                ...this.contactList.filter(contact => !contact.id)
            ];

        });
        // Eklenen kisi icin calisacak chat veya contact mevcut ise ekleyen kisinin privacy settingslerine gore profil photo  duzenlemeler yapilacak
        this.webSocketManagerContacts.subscribeToChannel(addContactUser, async (addContactMessage) => {
            const newContact = JSON.parse(addContactMessage.body);
            const findContact = this.contactList.find(contact => contact.userProfileResponseDTO.id === newContact.contactsDTO.userId);
            const findChat = this.chatList.find(chat => chat.userProfileResponseDTO.id === newContact.contactsDTO.userId);

            if (findChat) {
                findChat.contactsDTO.relatedUserHasAddedUser = newContact.contactsDTO.userHasAddedRelatedUser;
                findChat.userProfileResponseDTO.imagee = newContact.userProfileResponseDTO.imagee;
                if (newContact.userProfileResponseDTO.imagee) {
                    handleProfilePhotoVisibilityChange({
                        contact: { ...findChat.contactsDTO },
                        userProfileResponseDTO: { ...findChat.userProfileResponseDTO }

                    }, findChat.userProfileResponseDTO.imagee);
                }

            }
            if (findContact) {
                findContact.contactsDTO.relatedUserHasAddedUser = newContact.contactsDTO.userHasAddedRelatedUser;
                findContact.userProfileResponseDTO.imagee = newContact.userProfileResponseDTO.imagee;
                if (newContact.userProfileResponseDTO.imagee) {
                    handleProfilePhotoVisibilityChange({
                        contact: { ...findContact.contactsDTO },
                        userProfileResponseDTO: { ...findContact.userProfileResponseDTO }

                    }, findContact.userProfileResponseDTO.imagee);
                }
            }

        });

        this.webSocketManagerContacts.subscribeToChannel(addInvitation, async (addInvitationMessage) => {
            const newInvitation = JSON.parse(addInvitationMessage.body);
            let invitationIdList = this.contactList.filter(invitation => invitation.invitationResponseDTO);
            const indexToInsert = invitationIdList.findIndex(invitation => {
                return invitation.invitationResponseDTO.contactName.localeCompare(newInvitation.invitationResponseDTO.contactName, undefined, { sensitivity: 'base' }) > 0;
            });
            if (indexToInsert === -1) {
                invitationIdList.push(newInvitation);
            } else {
                invitationIdList.splice(indexToInsert, 0, newInvitation);
            }
            this.contactList = [
                ...this.contactList.filter(contact => contact.contactsDTO),
                ...invitationIdList
            ];
            console.log(this.contactList)
        });
        // ToDo
        this.webSocketManagerContacts.subscribeToChannel(updatePrivacy, async (updatePrivacyMessage) => {
            const updatePrivacy = JSON.parse(updatePrivacyMessage.body);

            const findContact = this.contactList.find(contact => contact.userProfileResponseDTO.id === updatePrivacy.id);
            const findChat = this.chatList.find(chat => chat.userProfileResponseDTO.id === updatePrivacy.id);

            let oldPrivacySettings = null;
            let newPrivacySettings;

            if (findChat || findContact) {
                if (findChat) {
                    oldPrivacySettings = findChat.userProfileResponseDTO.privacySettings;
                    findChat.userProfileResponseDTO = updatePrivacy;
                    newPrivacySettings = {
                        contactsDTO: {
                            contact: { ...findChat.contactsDTO },
                            userProfileResponseDTO: { ...findChat.userProfileResponseDTO }
                        }
                    }
                    if (oldPrivacySettings && newPrivacySettings) {
                        if ((updatePrivacy.privacySettings.profilePhotoVisibility !== oldPrivacySettings.profilePhotoVisibility)) {
                            handleProfilePhotoVisibilityChange(newPrivacySettings.contactsDTO, updatePrivacy.imagee);
                        }
                        if (updatePrivacy.privacySettings.onlineStatusVisibility !== oldPrivacySettings.onlineStatusVisibility) {
                            handleOnlineStatusVisibilityChange(this.user, newPrivacySettings);
                        }
                        if (updatePrivacy.privacySettings.lastSeenVisibility !== oldPrivacySettings.lastSeenVisibility) {
                            handleLastSeenVisibilityChange(this.user, newPrivacySettings);
                        }
                    }
                }
                if (findContact) {
                    oldPrivacySettings = findContact.userProfileResponseDTO.privacySettings;
                    findContact.userProfileResponseDTO = updatePrivacy;
                    newPrivacySettings = {
                        contactsDTO: {
                            contact: { ...findContact.contactsDTO },
                            userProfileResponseDTO: { ...findContact.userProfileResponseDTO }
                        }
                    }
                    if (oldPrivacySettings && newPrivacySettings) {
                        if (updatePrivacy.privacySettings.aboutVisibility !== oldPrivacySettings.aboutVisibility) {
                            handleAboutVisibilityChange(newPrivacySettings.contactsDTO);
                        }
                    }
                }
            }
        });
        // ToDo
        this.webSocketManagerContacts.subscribeToChannel(updatedProfilePhoto, async (updatedProfilePhotoMessage) => {

            const updatedProfilePhotoDTO = JSON.parse(updatedProfilePhotoMessage.body);

            const findContact = this.contactList.find(contact => contact.userProfileResponseDTO.id === updatedProfilePhotoDTO.userId);
            const findChat = this.chatList.find(chat => chat.userProfileResponseDTO.id === updatedProfilePhotoDTO.userId);

            let newPrivacySettings;

            if (findChat) {
                findChat.userProfileResponseDTO.imagee = updatedProfilePhotoDTO.url;
                newPrivacySettings = {
                    contactsDTO: {
                        contact: { ...findChat.contactsDTO },
                        userProfileResponseDTO: { ...findChat.userProfileResponseDTO }
                    }
                }
                if (updatedProfilePhotoDTO.url) {
                    handleProfilePhotoVisibilityChange({
                        contact: { ...findChat.contactsDTO },
                        userProfileResponseDTO: { ...findChat.userProfileResponseDTO }

                    }, findChat.userProfileResponseDTO.imagee);
                }

            }
            if (findContact) {
                findContact.userProfileResponseDTO.imagee = updatedProfilePhotoDTO.url;
                newPrivacySettings = {
                    contactsDTO: {
                        contact: { ...findContact.contactsDTO },
                        userProfileResponseDTO: { ...findContact.userProfileResponseDTO }
                    }
                }
            }
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
        const recipientMessageChannel = `/user/${this.user.id}/queue/received-message`;
        const typingChannel = `/user/${this.user.id}/queue/typing`;
        const stopTypingChannel = `/user/${this.user.id}/queue/stop-typing`;
        // const readConfirmationSenderChannel = `/user/${this.user.id}/queue/read-confirmation-sender`;
        const readMessagesChannel = `/user/${this.user.id}/queue/read-messages`;
        const chatBlock = `/user/${this.user.id}/queue/block`;
        const chatUnBlock = `/user/${this.user.id}/queue/unblock`;
        const error = `/user/${this.user.id}/queue/error-message`;


        this.webSocketManagerChat.subscribeToChannel(error, async (errorMessageDTO) => {
            const errorMessage = JSON.parse(errorMessageDTO.body);
            toastr.error(errorMessage.message);
        });

        this.webSocketManagerChat.subscribeToChannel(chatBlock, async (block) => {
            const blockData = JSON.parse(block.body);
            const chatData = this.chatList.find(chat => chat.chatDTO.id === blockData.chatRoomId);
            if (chatData) {
                chatData.userChatSettings.blockedMe = true;
            }
            if (isMessageBoxDomExists(chatData.chatDTO.id)) {
                const messageBoxElement = document.querySelector('.message-box');
                const statusSpan = messageBoxElement.querySelector('.online-status');
                if (statusSpan) {
                    statusSpan.remove();
                }
                this.webSocketManagerChat.unsubscribeFromChannel(`/user/${chatData.userProfileResponseDTO.id}/queue/online-status`);
                this.webSocketManagerChat.unsubscribeFromChannel(`/user/${this.user.id}/queue/message-box-typing`);
            }

        });
        this.webSocketManagerChat.subscribeToChannel(chatUnBlock, async (unblock) => {
            const unblockData = JSON.parse(unblock.body);
            const chatData = this.chatList.find(chat => chat.chatDTO.id === unblockData.chatRoomId);
            if (chatData) {
                chatData.userChatSettings.blockedMe = false;
            }
            if (isMessageBoxDomExists(chatData.chatDTO.id)) {
                const messageBoxElement = document.querySelector('.message-box');
                const statusSpan = messageBoxElement.querySelector('.online-status');
                const messageBoxOnlineStatus = messageBoxElement.querySelector('.message-box1-2-2');
                if (statusSpan) {
                    statusSpan.remove();
                }
                const chat = { user: { ...this.user }, contactsDTO: { contact: { ...chatData.contactsDTO }, userProfileResponseDTO: { ...chatData.userProfileResponseDTO } }, userChatSettings: { ...chatData.userChatSettings } }
                await onlineInfo(chat, messageBoxOnlineStatus);
            }

        });


        this.webSocketManagerChat.subscribeToChannel(readMessagesChannel, (readMessages) => {
            const readMessagesJSON = JSON.parse(readMessages.body);
            const firstReadMessage = readMessagesJSON[0];
            const messageBoxElement = document.querySelector('.message-box1');
            const chatBoxElements = [...document.querySelectorAll('.chat1')];
            const findChatElement = chatBoxElements.find(chatElement => chatElement.chatData.chatDTO.id === firstReadMessage.chatRoomId);
            const findChat = this.chatList.find(chat => chat.chatDTO.id === firstReadMessage.chatRoomId);
            findChat.chatDTO.seen = true;
            if (findChatElement) {
                const chatBoxElementDeliveredTick = findChatElement.querySelector('.message-span').firstElementChild;
                chatBoxElementDeliveredTick.className = 'message-seen-tick-span';
                chatBoxElementDeliveredTick.ariaLabel = ' Okundu ';
            }
            if (messageBoxElement) {
                const messageData = messageBoxElement.data;
                messageBoxElementMessagesReadTick(readMessagesJSON, messageData.contactsDTO.userProfileResponseDTO.privacySettings);
            }

        });

        this.webSocketManagerChat.subscribeToChannel(recipientMessageChannel, async (recipientMessage) => {
            const recipientJSON = JSON.parse(recipientMessage.body);
            const decryptedMessage = await decryptMessage(recipientJSON);
            const chat = this.chatList.find(chat => chat.chatDTO.id === recipientJSON.chatRoomId);
            if (!chat) {
                await createChatBoxWithFirstMessage(recipientJSON)
            } else {
                chat.userChatSettings.unreadMessageCount = recipientJSON.unreadMessageCount;
                chat.chatDTO.lastMessage = decryptedMessage;
                chat.chatDTO.lastMessageTime = recipientJSON.fullDateTime;
                updateChatBox(chat);
                const chatElements = [...document.querySelectorAll('.chat1')];
                const chatElement = chatElements.find(chat => chat.chatData.chatDTO.id === recipientJSON.chatRoomId);

                let unreadMessageCountDiv;
                let chatOptionsDiv;
                if (chatElement) {
                    chatOptionsDiv = chatElement.querySelector('.chat-options');
                    const unreadMessageCountSpan = chatElement.querySelector('.unread-message-count-span');
                    if (unreadMessageCountSpan) {
                        unreadMessageCountSpan.textContent = recipientJSON.unreadMessageCount;
                    } else {
                        unreadMessageCountDiv = createElement('div', 'unread-message-count-div');
                        const unreadMessageCountSpan = createElement('span', 'unread-message-count-span', {}, { 'aria-label': `${recipientJSON.unreadMessageCount} okunmamış mesaj` }, recipientJSON.unreadMessageCount);
                        unreadMessageCountDiv.append(unreadMessageCountSpan);
                        chatOptionsDiv.firstElementChild.append(unreadMessageCountDiv);
                    }
                    const messageTickSpan = chatElement.querySelector('.message-delivered-tick-div');
                    if (messageTickSpan) {
                        messageTickSpan.remove();
                    }

                }
                if (isMessageBoxDomExists(recipientJSON.chatRoomId)) {
                    const dto = {
                        recipientId: recipientJSON.recipientId,
                        userChatSettingsId: chat.userChatSettings.id,
                        chatRoomId: recipientJSON.chatRoomId,
                        senderId: recipientJSON.senderId
                    };
                    chatInstance.webSocketManagerChat.sendMessageToAppChannel("read-message", dto);
                    renderMessage({ messages: recipientJSON, lastPage: null }, chat.userProfileResponseDTO.privacySettings, true);
                }
                lastMessageChange(recipientJSON.chatRoomId, chatElement, decryptedMessage, recipientJSON.fullDateTime);


            }
        })
        this.webSocketManagerChat.subscribeToChannel(typingChannel, async (typingMessage) => {
            const status = JSON.parse(typingMessage.body);
            const visibleChats = [...document.querySelectorAll(".chat1")];
            if (visibleChats) {
                const chat = visibleChats.find(el => el.chatData.chatDTO.id === status.chatRoomId);
                if (chat && !chat.chatData.userChatSettings.blocked && !chat.chatData.userChatSettings.blockedMe) {
                    const messageSpan = chat.querySelector(".message-span");
                    const messageSpanSpan = chat.querySelector(".message-span-span");

                    if (status.typing) {
                        if (chat.chatData.chatDTO.senderId === this.user.id) {
                            messageSpan.removeChild(messageSpan.firstElementChild);
                        }
                        messageSpanSpan.textContent = 'yaziyor...';
                    } else {
                        if (chat.chatData.chatDTO.senderId === this.user.id) {
                            const messageDeliveredTickElement = createMessageDeliveredTickElement();
                            if (chat.chatData.chatDTO.seen) {
                                messageDeliveredTickElement.firstElementChild.className = 'message-seen-tick-span';
                                messageDeliveredTickElement.firstElementChild.ariaLabel = ' Okundu ';
                            }
                            messageSpan.prepend(messageDeliveredTickElement);

                        }
                        messageSpanSpan.textContent = await decryptMessage(chat.chatData.chatDTO, chat.chatData.chatDTO.senderId === this.user.id);
                    }
                }
            }
        });
    }

    async initialData() {
        const storageId = sessionStorage.getItem('id');
        const reponse = await fetchGetUserWithUserKeyByAuthId(storageId);
        this.user = reponse.data;

        if (this.user) {

            if (this.user.updatedAt == null) {
                userUpdateModal(this.user, false);
            }
            if (!getUserKey()) {
                try {
                    const storedSessionKey = sessionStorage.getItem('sessionKey');
                    const storedEncryptedPrivateKey = localStorage.getItem('encryptedPrivateKey');
                    const storedIv = localStorage.getItem('encryptionIv');
                    const storedPublicKey = sessionStorage.getItem("publicKey");
                    if (storedSessionKey && storedEncryptedPrivateKey && storedIv) {
                        const sessionKey = base64ToUint8Array(storedSessionKey);
                        setSessionKey(sessionKey);

                        const decryptedPrivateKey = await decryptWithSessionKey(
                            base64ToUint8Array(storedEncryptedPrivateKey),
                            base64ToUint8Array(storedIv)
                        );

                        const privateKey = await window.crypto.subtle.importKey(
                            "pkcs8",
                            decryptedPrivateKey,
                            { name: "RSA-OAEP", hash: "SHA-256" },
                            false,
                            ["decrypt"]
                        );

                        const publicKey = await importPublicKey(new base64ToUint8Array(storedPublicKey));
                        setUserKey({ privateKey, publicKey });
                    }
                } catch (error) {
                    console.error('Session restore error:', error);
                    navigateTo('/login');
                }
            }
            if (this.user.imagee) {
                const image = createProfileImage(this.user);
                const userProfilePhotoElement = document.querySelector('.user-profile-photo');
                userProfilePhotoElement.removeChild(userProfilePhotoElement.firstChild);
                userProfilePhotoElement.append(image);
            }

            this.contactList = (await fetchGetContactList(this.user.id))
                .map(item => new FeignClientUserProfileResponseDTO(item));
            this.chatList = (await fetchGetChatSummaries(this.user.id))
                .map(item => new ChatSummaryDTO(item));
            console.log(this.chatList)
            console.log(this.contactList)
            await handleChats();
        } else {
            navigateTo("/login");
        }

    }

    async addEventListeners() {
        const chatListContentElement = document.querySelector(".chat-list-content")
        const addFriendButtonElement = document.querySelector(".add-friendd");
        const chatListHeaderElement = document.querySelector(".chat-list-header");
        const contactListButtonElement = document.querySelector(".friend-list-btn");
        const friendApprovalButtonElement = document.querySelector(".friend-approval");
        const chatSearchBarElement = document.querySelector('#chats-search-bar');
        const friendRequestReplyNotificationElement = document.querySelector(".friend-request-reply-notification");
        const settingsBtnElement = document.querySelector(".settings-btn");
        const userProfileImageButton = document.querySelector(".user-profile-photo");

        if (userProfileImageButton) {
            userProfileImageButton.addEventListener("click", () => {
                userUpdateModal(this.user, true);
            });

        }


        if (addFriendButtonElement) {
            addFriendButtonElement.addEventListener("click", () => {
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
                createSettingsHtml(this.user);
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
        createContactList();
    }

    logout() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);

        if (this.webSocketManagerContacts) {
            this.webSocketManagerChat.notifyOnlineStatus(false);
            this.webSocketManagerContacts.disconnectWebSocket();
        }
        if (this.webSocketManagerChat) {
            this.webSocketManagerChat.disconnectWebSocket();
        }
        sessionStorage.clear();
        navigateTo('/');
    }

}

const handleLastSeenVisibilityChange = (user, newContactPrivacy) => {
    const messageBoxElement = document.querySelector('.message-box1');
    if (messageBoxElement && messageBoxElement.data.contactsDTO.userProfileResponseDTO.id === newContactPrivacy.contactsDTO.userProfileResponseDTO.id) {
        const statusElement = messageBoxElement.querySelector('.online-status');
        if (user.privacySettings.lastSeenVisibility === 'EVERYONE' || (newContactPrivacy.contactsDTO.contact.userHasAddedRelatedUser && user.privacySettings.lastSeenVisibility === 'CONTACTS')) {
            if (newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings.lastSeenVisibility === 'EVERYONE') {
                if (!statusElement) {
                    const contactsOnlineStatusElement = isOnlineStatus(user, newContactPrivacy.contactsDTO);
                    const onlineStatusParentElement = messageBoxElement.querySelector('.message-box1-2-2');
                    if (contactsOnlineStatusElement && onlineStatusParentElement) {
                        onlineStatusParentElement.append(contactsOnlineStatusElement);
                    }
                }
            } else if (newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings.lastSeenVisibility === 'CONTACTS' && newContactPrivacy.contactsDTO.contact.relatedUserHasAddedUser) {
                if (!statusElement) {
                    const contactsOnlineStatusElement = isOnlineStatus(user, newContactPrivacy.contactsDTO);
                    const onlineStatusParentElement = messageBoxElement.querySelector('.message-box1-2-2');
                    if (contactsOnlineStatusElement && onlineStatusParentElement) {
                        onlineStatusParentElement.append(contactsOnlineStatusElement);
                    }
                }
            }
            else {
                if (statusElement) {
                    statusElement.remove();
                }
            }
        }

    }
}

const handleOnlineStatusVisibilityChange = (user, newContactPrivacy) => {
    const messageBoxElement = document.querySelector('.message-box1');
    if (messageBoxElement && messageBoxElement.data.contactsDTO.userProfileResponseDTO.id === newContactPrivacy.contactsDTO.userProfileResponseDTO.id) {
        const statusElement = messageBoxElement.querySelector('.online-status');
        if (user.privacySettings.onlineStatusVisibility === 'EVERYONE' || (newContactPrivacy.contactsDTO.contact.userHasAddedRelatedUser && user.privacySettings.onlineStatusVisibility === 'CONTACTS')) {
            if (newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings.onlineStatusVisibility === 'EVERYONE') {
                if (!statusElement) {
                    const contactsOnlineStatusElement = isOnlineStatus(user, newContactPrivacy.contactsDTO);
                    const onlineStatusParentElement = messageBoxElement.querySelector('.message-box1-2-2');
                    if (contactsOnlineStatusElement && onlineStatusParentElement) {
                        onlineStatusParentElement.append(contactsOnlineStatusElement);
                    }
                }
            } else if (newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings.onlineStatusVisibility === 'CONTACTS' && newContactPrivacy.contactsDTO.contact.relatedUserHasAddedUser) {
                if (!statusElement) {
                    const contactsOnlineStatusElement = isOnlineStatus(user, newContactPrivacy.contactsDTO);
                    const onlineStatusParentElement = messageBoxElement.querySelector('.message-box1-2-2');
                    if (contactsOnlineStatusElement && onlineStatusParentElement) {
                        onlineStatusParentElement.append(contactsOnlineStatusElement);
                    }
                }
            }
            else {
                if (statusElement) {
                    statusElement.remove();
                }
            }
        }

    }
}
const handleProfilePhotoVisibilityChange = (newValue, image) => {

    const visibleChatsElements = [...document.querySelectorAll('.chat1')];
    const visibleChatElement = visibleChatsElements.find(chat => chat.chatData.userProfileResponseDTO.id === newValue.userProfileResponseDTO.id);
    const bool = (newValue.userProfileResponseDTO.privacySettings.profilePhotoVisibility === 'EVERYONE') || (newValue.userProfileResponseDTO.privacySettings.profilePhotoVisibility === 'CONTACTS' && newValue.contact.relatedUserHasAddedUser);
    if (visibleChatElement) {
        debugger;
        const imageElement = visibleChatElement.querySelector('.image');
        changesVisibilityProfilePhoto(bool, imageElement, image);
    }
    if (document.querySelector('.a1-1-1-1-1-1-3')) {
        const visibleContactsElements = [...document.querySelectorAll('.contact1')];
        const visibleContactElement = visibleContactsElements.find(chat => chat.contactData.userProfileResponseDTO.id === newValue.userProfileResponseDTO.id);
        const imageElement = visibleContactElement?.querySelector('.image');
        changesVisibilityProfilePhoto(bool, imageElement, image);
    }
    const messageBoxElement = document.querySelector('.message-box1');
    if (messageBoxElement && messageBoxElement.data.contactsDTO.userProfileResponseDTO.id === newValue.userProfileResponseDTO.id) {
        const imageElement = messageBoxElement.querySelector('.message-box1-2-1-1');
        changesVisibilityProfilePhoto(bool, imageElement, image);
    }
}
const changesVisibilityProfilePhoto = (bool, imageElement, image) => {
    if (bool && imageElement) {
        if (imageElement.firstElementChild.className === 'svg-div') {
            imageElement.removeChild(imageElement.firstElementChild);
            const imgElement = createElement('img', 'user-image', {}, { 'src': `${image}`, 'alt': '', 'draggable': 'false', 'tabindex': '-1' });
            imageElement.append(imgElement);
        } else {
            imageElement.firstElementChild.src = image;
        }
    } else {
        if (imageElement?.firstElementChild.className === 'user-image') {
            imageElement.removeChild(imageElement.firstElementChild);
            const svgDiv = createElement('div', 'svg-div');

            const svgSpan = createElement('span', '', {}, { 'aria-hidden': 'true', 'data-icon': 'default-user' });
            const svgElement = createSvgElement('svg', { class: 'svg-element', viewBox: '0 0 212 212', height: '212', width: '212', preserveAspectRatio: 'xMidYMid meet', version: '1.1', x: '0px', y: '0px', 'enable-background': 'new 0 0 212 212' });
            const titleElement = createSvgElement('title', {});
            titleElement.textContent = 'default-user';
            const pathBackground = createSvgElement('path', { fill: '#DFE5E7', class: 'background', d: 'M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z' });
            const groupElement = createSvgElement('g', {});
            const pathPrimary1 = createSvgElement('path', { fill: '#FFFFFF', class: 'primary', d: 'M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z' });
            const pathPrimary2 = createSvgElement('path', { fill: '#FFFFFF', class: 'primary', d: 'M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z' });

            svgElement.append(titleElement);
            svgElement.append(pathBackground);
            groupElement.append(pathPrimary1);
            groupElement.append(pathPrimary2);
            svgElement.append(groupElement);
            svgSpan.append(svgElement);
            svgDiv.append(svgSpan);
            imageElement.append(svgDiv);
        }
    }
}

const handleAboutVisibilityChange = (newValue) => {
    const bool = (newValue.userProfileResponseDTO.privacySettings.aboutVisibility === 'EVERYONE') || (newValue.userProfileResponseDTO.privacySettings.aboutVisibility === 'CONTACTS' && newValue.contact.userHasAddedRelatedUser);
    if (document.querySelector('.a1-1-1-1-1-1-3')) {
        const visibleContactsElements = [...document.querySelectorAll('.contact1')];
        const visibleContactElement = visibleContactsElements.find(chat => chat.contactData.userProfileResponseDTO.id === newValue.userProfileResponseDTO.id);
        const aboutElement = visibleContactElement?.querySelector('.message');
        changesVisibilityAbout(bool, aboutElement, newValue.userProfileResponseDTO.about);
    }
}
const changesVisibilityAbout = (bool, aboutElement, about) => {
    if (bool) {
        if (aboutElement) {
            if (!aboutElement.firstElementChild) {
                const messageSpan = createElement('span', 'message-span', {}, { 'title': '' });
                aboutElement.append(messageSpan);
                const innerSpan = createElement('span', 'message-span-span', {}, { 'dir': 'ltr', 'aria-label': '' }, about);
                messageSpan.append(innerSpan);
            }
        }
    } else {
        if (aboutElement && aboutElement.firstElementChild) {
            aboutElement.removeChild(aboutElement.firstElementChild);
        }

    }
}

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