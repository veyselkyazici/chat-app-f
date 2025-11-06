// Chat.js
import AbstractView from "./AbstractView.js";
import renderContactList from "../components/Contacts.js";
import { createSettingsHtml } from "../components/Settings.js";
import { addContactModal } from "../components/AddContact.js";
import WebSocketManager from "../websocket.js";
import { SearchHandler } from "../utils/searchHandler.js";
import {
  createElement,
  createSvgElement,
  createProfileImage,
} from "../utils/util.js";
import {
  handleChats,
  createChatBoxWithFirstMessage,
  lastMessageChange,
  updateChatBox,
} from "../components/ChatBox.js";
import {
  isOnlineStatus,
  isMessageBoxDomExists,
  renderMessage,
  messageBoxElementMessagesReadTick,
  createMessageDeliveredTickElement,
  onlineInfo,
} from "../components/MessageBox.js";
import { navigateTo } from "../index.js";
import { userService } from "../services/userService.js";
import { contactService } from "../services/contactsService.js";
import { chatService } from "../services/chatService.js";
import { userUpdateModal } from "../components/UpdateUserProfile.js";
import {
  importPublicKey,
  base64ToUint8Array,
  getUserKey,
  setUserKey,
  decryptMessage,
  setSessionKey,
  decryptWithSessionKey,
} from "../utils/e2ee.js";
import { MessageDTO } from "../dtos/chat/response/MessageDTO.js";
import { ChatSummaryDTO } from "../dtos/chat/response/ChatSummaryDTO.js";
import { ContactResponseDTO } from "../dtos/contact/response/ContactResponseDTO.js";
import { authService } from "../services/authService.js";
import { i18n } from "../i18n/i18n.js";

export let webSocketManagerContacts;
export let webSocketManagerChat;
export let chatInstance;

export default class Chat extends AbstractView {
  constructor(params) {
    super(params);
    chatInstance = this;
    this.setTitle("Chat");
    this.chatSearchHandler = null;
    this.visibleItemCount = 0;
    this.selectedChatUserId = null;
    this.user = {};
    this.chatList = [];
    this.contactList = [];
    this.pingInterval = null;
    this.pingFrequency = 10000;
  }

  async getHtml() {
    return `<div class="overlay-spinner hidden">
  <div class="spinner"></div>
</div><div id="chat-loading-screen" class="chat-loading-screen"><span></span><div class="loading-container"><div class="loading-logo"><div class="whatsapp-logo"><i class="fas fa-comments fa-2x"></i></div></div><div class="loading-text"><p>Please wait</p></div><div class="loading-spinner"><div class="spinner"></div></div></div></div><span class></span><span class></span><span class></span><div class="chat-container"><div class="xixxii4"></div><div class="a1"><div class="a1-1"><span class="a1-1-1"></span></div><div class="a1-2"><span class="a1-2-1"></span></div></div><div class="chats"><header><header class="chat-list-header"><div class="user-photo">
<div class="user-profile-photo"  style="height: 49px; width: 49px;" role="button"><div class="svg-div"><span class="" aria-hidden="true" data-icon="default-user"><svg class="svg-element" viewBox="0 0 212 212" height="212" width="212" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 212 212"><title>default-user</title><path fill="#DFE5E7" class="background" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g><path fill="#FFFFFF" class="primary" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" class="primary" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path></g></svg></span></div></div>
</div><div class="options-div"><div class="options"><div class="friend-list-btn option" tabindex="0" role="button" title="Yeni Sohbet Başlat" aria-label="Yeni Sohbet Başlat"><span class="friend-list-icon option material-symbols-outlined">chat_add_on</span></div><div class="add-friendd option" tabindex="0" role="button" title="Add contact" aria-label="Add contact"><i class="fa-solid fa-plus"></i></div><div class="settings-btn option" tabindex="0" role="button" title="Options" aria-label="Options"> <i class="fa-solid fa-gear"></i></div></div></div></header></header><div class="chat-content side">
<div tabindex="-1" class="css1"><div class="chats-search-bar search-bar" id="chats-search-bar"><div></div><div class="css2"><button class="css3" tabindex="-1"><div class="css5"><span data-icon="search" class=""><svg viewBox="0 0 20 20" height="20" width="20" preserveAspectRatio="xMidYMid meet" fill="none"><title>search</title><path fill-rule="evenodd" clip-rule="evenodd" d="M4.36653 4.3664C5.36341 3.36953 6.57714 2.87 8.00012 2.87C9.42309 2.87 10.6368 3.36953 11.6337 4.3664C12.6306 5.36329 13.1301 6.57724 13.1301 8.00062C13.1301 8.57523 13.0412 9.11883 12.8624 9.63057C12.6972 10.1038 12.4733 10.5419 12.1909 10.9444L16.5712 15.3247C16.7454 15.4989 16.8385 15.7046 16.8385 15.9375C16.8385 16.1704 16.7454 16.3761 16.5712 16.5503C16.396 16.7254 16.1866 16.8175 15.948 16.8175C15.7095 16.8175 15.5001 16.7254 15.3249 16.5503L10.9448 12.1906C10.5421 12.4731 10.104 12.697 9.63069 12.8623C9.11895 13.041 8.57535 13.13 8.00074 13.13C6.57736 13.13 5.36341 12.6305 4.36653 11.6336C3.36965 10.6367 2.87012 9.42297 2.87012 8C2.87012 6.57702 3.36965 5.36328 4.36653 4.3664ZM8.00012 4.63C7.06198 4.63 6.26877 4.95685 5.61287 5.61275C4.95698 6.26865 4.63012 7.06186 4.63012 8C4.63012 8.93813 4.95698 9.73134 5.61287 10.3872C6.26877 11.0431 7.06198 11.37 8.00012 11.37C8.93826 11.37 9.73146 11.0431 10.3874 10.3872C11.0433 9.73134 11.3701 8.93813 11.3701 8C11.3701 7.06186 11.0433 6.26865 10.3874 5.61275C9.73146 4.95685 8.93826 4.63 8.00012 4.63Z" fill="currentColor"></path></svg></span></div></button><span></span><div class="css7"><div class="css8"><div class="css9" contenteditable="true" role="textbox" title="Arama metni giriş alanı" tabindex="3" aria-placeholder="Search" style="min-height: 1.47em; user-select: text; white-space: pre-wrap; word-break: break-word;"><p class="selectable-text1"><br></p></div><div class="css12"><div class="css122">${i18n.t(
      "search.searchPlaceHolder"
    )}</div></div></div></div></div></div></div><span class="css13"></span><div class="pane-side" id="pane-side"><div class="css10"><div class="css11"></div></div><div tabindex="-1" class data-tab="4"><div tabindex="-1" style="pointer-events: auto;"><div class="chat-list-content" role="grid"></div></div></div></div></div></div><div class="message-box" id="chatWindow"><div class="start-message">${i18n.t(
      "selectMessageBoxMessage.selectMessageBoxMessage"
    )}</div></div><div class="contact-information profile"><span class="contact-information-span"></span></div></div>`;
  }

  async init() {
    try {
      this.updateLoadingProgress(i18n.t("chat.loadingMessage"));

      this.addEventListeners();
      // await this.delay(5000);
      await this.initialData();
      this.chatSearchInit();
      this.hideLoadingScreen();
    } catch (error) {
      console.error(error);
      this.updateLoadingProgress(i18n.t("chat.loadingErrorMessage"));
    }
  }
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async initialData() {
    const storageId = sessionStorage.getItem("id");
    const reponse = await userService.getUserWithUserKeyByAuthId(storageId);
    this.user = reponse.data;
    if (this.user) {
      this.initializeWebSockets();
      if (this.user.updatedAt == null) {
        this.hideLoadingScreen();
        userUpdateModal(this.user, false);
      }
      if (!getUserKey()) {
        try {
          this.handleMissingUserKey();
        } catch (error) {
          console.error("Session restore error:", error);
          navigateTo("/login");
        }
      }
      if (this.user.imagee) {
        const image = createProfileImage(this.user);
        const userProfilePhotoElement = document.querySelector(
          ".user-profile-photo"
        );
        userProfilePhotoElement.removeChild(userProfilePhotoElement.firstChild);
        userProfilePhotoElement.append(image);
      }
      await this.getContactList();
      await this.getChatList();
    } else {
      navigateTo("/login");
    }
  }
  async handleMissingUserKey() {
    const storedSessionKey = sessionStorage.getItem("sessionKey");
    const storedEncryptedPrivateKey = sessionStorage.getItem(
      "encryptedPrivateKey"
    );
    const storedIv = sessionStorage.getItem("encryptionIv");
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

      const publicKey = await importPublicKey(
        new base64ToUint8Array(storedPublicKey)
      );
      setUserKey({ privateKey, publicKey });
    }
  }
  async getContactList() {
    this.contactList = (await contactService.getContactList(this.user.id)).map(
      (item) => new ContactResponseDTO(item)
    );
  }
  async getChatList() {
    const summaries = await chatService.getChatSummaries();
    this.chatList = await Promise.all(
      summaries.map(async (item) => {
        const isSender =
          item.chatDTO.messages[0].senderId === chatInstance.user.id;
        item.chatDTO.messages[0].decryptedMessage = await decryptMessage(
          item.chatDTO.messages[0],
          isSender
        );
        return new ChatSummaryDTO(item);
      })
    );
    await handleChats(this.chatList);
  }
  initializeWebSockets() {
    this.webSocketManagerContacts = new WebSocketManager(
      import.meta.env.VITE_BASE_URL_WEBSOCKET_CONTACTS,
      this.user.id,
      sessionStorage.getItem("access_token")
    );

    this.webSocketManagerChat = new WebSocketManager(
      import.meta.env.VITE_BASE_URL_WEBSOCKET_CHAT,
      this.user.id,
      sessionStorage.getItem("access_token")
    );

    this.initChatWebSocket();
    this.initContactsWebSocket();
    this.startPing();

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  }
  chatSearchInit() {
    this.chatSearchHandler = new SearchHandler({
      listData: this.chatList,
      listContentSelector: ".chat-list-content",
      createItemFunction: handleChats,
      filterFunction: (chat, value) => {
        const name = (
          chat.contactsDTO?.userContactName ??
          chat.userProfileResponseDTO?.email ??
          ""
        ).toLowerCase();
        const lastMsg = (
          chat.chatDTO?.messages[0].decryptedMessage ?? ""
        ).toLowerCase();
        return !value || name.includes(value) || lastMsg.includes(value);
      },
      clearButtonSelector: ".css2 span:empty",
      placeholderConfig: {
        className: "css12",
        innerClassName: "css122",
        text: i18n.t("search.searchPlaceHolder"),
      },
      restoreFunction: handleChats,
    });
  }
  hideLoadingScreen() {
    const loadingScreen = document.getElementById("chat-loading-screen");
    const mainContent = document.querySelector(".chat-container");

    if (loadingScreen && mainContent) {
      loadingScreen.style.display = "none";
    }
  }

  updateLoadingProgress(message) {
    const loadingText = document.querySelector(".loading-text p");
    if (loadingText) {
      loadingText.textContent = message;
    }
  }

  async initContactsWebSocket() {
    this.webSocketManagerContacts.connectWebSocket(
      () => {
        this.subscribeToFriendshipChannels();
      },
      (error) => {
        console.error("Contacts WebSocket bağlantı hatası: " + error);
      }
    );
  }
  subscribeToFriendshipChannels() {
    const addContact = `/user/${this.user.id}/queue/add-contact`;
    const addContactUser = `/user/${this.user.id}/queue/add-contact-user`;
    const addInvitation = `/user/${this.user.id}/queue/add-invitation`;
    const updatePrivacy = `/user/${this.user.id}/queue/updated-privacy-response`;
    const updatedUserProfile = `/user/${this.user.id}/queue/updated-user-profile-message`;
    const disconnect = `/user/${this.user.id}/queue/disconnect`;
    const invitedUserJoined = `/user/${this.user.id}/queue/invited-user-joined`;

    this.webSocketManagerContacts.subscribeToChannel(
      invitedUserJoined,
      async (invitedUserJoinedMessage) => {
        const invitedUserJoinedResponseDTO = new ContactResponseDTO(
          JSON.parse(invitedUserJoinedMessage.body)
        );
        this.contactList = this.contactList.filter((contact) => {
          if (contact.contactsDTO) {
            return true;
          } else {
            return contact.invitationResponseDTO?.inviteeEmail !==
              invitedUserJoinedResponseDTO.userProfileResponseDTO.email
              ? true
              : false;
          }
        });

        let inserted = false;

        const newName =
          invitedUserJoinedResponseDTO.contactsDTO.userContactName;

        for (let i = 0; i < this.contactList.length; i++) {
          const current = this.contactList[i];
          const currentName = current.contactsDTO?.userContactName;
          if (currentName && newName.localeCompare(currentName) < 0) {
            this.contactList.splice(i, 0, invitedUserJoinedResponseDTO);
            inserted = true;
            break;
          }
        }
        if (!inserted) {
          this.contactList.push(invitedUserJoinedResponseDTO);
        }
      }
    );

    this.webSocketManagerContacts.subscribeToChannel(disconnect, async () => {
      await this.logout();
    });

    this.webSocketManagerContacts.subscribeToChannel(
      `/user/${this.userId}/queue/error`,
      (message) => {
        try {
          const errorPayload = JSON.parse(message.body);
          console.error("❌ WebSocket Error:", errorPayload);
        } catch (e) {
          console.error("❌ WebSocket Error (raw):", message.body);
        }
      }
    );

    this.webSocketManagerContacts.subscribeToChannel(
      addContact,
      async (addContactMessage) => {
        const newContact = JSON.parse(addContactMessage.body);
        const chatElements = [...document.querySelectorAll(".chat1")];
        const chatElement = chatElements.find(
          (chat) =>
            chat.chatData.userProfileResponseDTO.id ===
            newContact.userProfileResponseDTO.id
        );
        if (chatElement) {
          const nameSpan = chatElement.querySelector(".name-span");
          nameSpan.textContent = newContact.contactsDTO.userContactName;
          chatElement.chatData.contactsDTO.userContactName =
            newContact.contactsDTO.userContactName;
          const findChat = chatInstance.chatList.find(
            (chat) =>
              chat.userProfileResponseDTO.id ===
              newContact.userProfileResponseDTO.id
          );
          if (findChat) {
            findChat.contactsDTO.userHasAddedRelatedUser = true;
            findChat.contactsDTO.userContactName =
              newContact.contactsDTO.userContactName;
          }
        }

        let contactIdList = this.contactList.filter((contact) => contact.id);

        const indexToInsert = contactIdList.findIndex((contact) => {
          return (
            contact.userContactName.localeCompare(
              newContact.userContactName,
              undefined,
              { sensitivity: "base" }
            ) > 0
          );
        });
        if (indexToInsert === -1) {
          contactIdList.push(newContact);
        } else {
          contactIdList.splice(indexToInsert, 0, newContact);
        }
        this.contactList = [
          ...contactIdList,
          ...this.contactList.filter((contact) => !contact.id),
        ];
      }
    );
    // Eklenen kisi icin calisacak chat veya contact mevcut ise ekleyen kisinin privacy settingslerine gore profil photo  duzenlemeler yapilacak
    this.webSocketManagerContacts.subscribeToChannel(
      addContactUser,
      async (addContactMessage) => {
        const newContact = JSON.parse(addContactMessage.body);
        const findContact = this.contactList.find(
          (contact) =>
            contact.userProfileResponseDTO.id === newContact.contactsDTO.userId
        );
        const findChat = this.chatList.find(
          (chat) =>
            chat.userProfileResponseDTO.id === newContact.contactsDTO.userId
        );

        if (findChat) {
          findChat.contactsDTO.relatedUserHasAddedUser =
            newContact.contactsDTO.userHasAddedRelatedUser;
          findChat.userProfileResponseDTO.imagee =
            newContact.userProfileResponseDTO.imagee;
          if (newContact.userProfileResponseDTO.imagee) {
            handleProfilePhotoVisibilityChange(
              {
                contact: { ...findChat.contactsDTO },
                userProfileResponseDTO: { ...findChat.userProfileResponseDTO },
              },
              findChat.userProfileResponseDTO.imagee
            );
          }
        }
        if (findContact) {
          findContact.contactsDTO.relatedUserHasAddedUser =
            newContact.contactsDTO.userHasAddedRelatedUser;
          findContact.userProfileResponseDTO.imagee =
            newContact.userProfileResponseDTO.imagee;
          if (newContact.userProfileResponseDTO.imagee) {
            handleProfilePhotoVisibilityChange(
              {
                contact: { ...findContact.contactsDTO },
                userProfileResponseDTO: {
                  ...findContact.userProfileResponseDTO,
                },
              },
              findContact.userProfileResponseDTO.imagee
            );
          }
        }
      }
    );

    this.webSocketManagerContacts.subscribeToChannel(
      addInvitation,
      async (addInvitationMessage) => {
        const newInvitation = JSON.parse(addInvitationMessage.body);
        let invitationIdList = this.contactList.filter(
          (invitation) => invitation.invitationResponseDTO
        );
        const indexToInsert = invitationIdList.findIndex((invitation) => {
          return (
            invitation.invitationResponseDTO.contactName.localeCompare(
              newInvitation.invitationResponseDTO.contactName,
              undefined,
              { sensitivity: "base" }
            ) > 0
          );
        });
        if (indexToInsert === -1) {
          invitationIdList.push(newInvitation);
        } else {
          invitationIdList.splice(indexToInsert, 0, newInvitation);
        }
        this.contactList = [
          ...this.contactList.filter((contact) => contact.contactsDTO),
          ...invitationIdList,
        ];
      }
    );
    // ToDo
    this.webSocketManagerContacts.subscribeToChannel(
      updatePrivacy,
      async (updatePrivacyMessage) => {
        const updatePrivacy = JSON.parse(updatePrivacyMessage.body);
        const findContact = this.contactList.find(
          (contact) => contact.userProfileResponseDTO?.id === updatePrivacy.id
        );
        const findChat = this.chatList.find(
          (chat) => chat.userProfileResponseDTO.id === updatePrivacy.id
        );

        let oldPrivacySettings = null;
        let newPrivacySettings;

        if (findChat || findContact) {
          if (findChat) {
            oldPrivacySettings =
              findChat.userProfileResponseDTO.privacySettings;
            findChat.userProfileResponseDTO = updatePrivacy;

            newPrivacySettings = {
              contactsDTO: {
                contact: { ...findChat.contactsDTO },
                userProfileResponseDTO: { ...findChat.userProfileResponseDTO },
              },
            };
            if (oldPrivacySettings && newPrivacySettings) {
              if (
                updatePrivacy.privacySettings.profilePhotoVisibility !==
                oldPrivacySettings.profilePhotoVisibility
              ) {
                handleProfilePhotoVisibilityChange(
                  newPrivacySettings.contactsDTO,
                  updatePrivacy.imagee
                );
              }
              if (
                updatePrivacy.privacySettings.onlineStatusVisibility !==
                oldPrivacySettings.onlineStatusVisibility
              ) {
                handleOnlineStatusVisibilityChange(
                  this.user,
                  newPrivacySettings
                );
              }
              if (
                updatePrivacy.privacySettings.lastSeenVisibility !==
                oldPrivacySettings.lastSeenVisibility
              ) {
                handleLastSeenVisibilityChange(this.user, newPrivacySettings);
              }
            }
          }
          if (findContact) {
            oldPrivacySettings =
              findContact.userProfileResponseDTO.privacySettings;
            findContact.userProfileResponseDTO = updatePrivacy;
            newPrivacySettings = {
              contactsDTO: {
                contact: { ...findContact.contactsDTO },
                userProfileResponseDTO: {
                  ...findContact.userProfileResponseDTO,
                },
              },
            };
            if (oldPrivacySettings && newPrivacySettings) {
              if (
                updatePrivacy.privacySettings.aboutVisibility !==
                oldPrivacySettings.aboutVisibility
              ) {
                handleAboutVisibilityChange(newPrivacySettings.contactsDTO);
              }
            }
          }
        }
      }
    );
    // ToDo
    this.webSocketManagerContacts.subscribeToChannel(
      updatedUserProfile,
      async (updatedUserProfileMessage) => {
        const updatedUserProfileDTO = JSON.parse(
          updatedUserProfileMessage.body
        );

        const findContact = this.contactList.find(
          (contact) =>
            contact.userProfileResponseDTO?.id === updatedUserProfileDTO.userId
        );
        const findChat = this.chatList.find(
          (chat) =>
            chat.userProfileResponseDTO.id === updatedUserProfileDTO.userId
        );

        let newPrivacySettings;

        if (findChat) {
          findChat.userProfileResponseDTO.imagee = updatedUserProfileDTO.url;
          findChat.userProfileResponseDTO.about = updatedUserProfileDTO.about;
          findChat.userProfileResponseDTO.firstName =
            updatedUserProfileDTO.firstName;
          newPrivacySettings = {
            contactsDTO: {
              contact: { ...findChat.contactsDTO },
              userProfileResponseDTO: { ...findChat.userProfileResponseDTO },
            },
          };
          handleProfilePhotoVisibilityChange(
            {
              contact: { ...findChat.contactsDTO },
              userProfileResponseDTO: { ...findChat.userProfileResponseDTO },
            },
            findChat.userProfileResponseDTO.imagee
          );
        }
        if (findContact) {
          findContact.userProfileResponseDTO.imagee = updatedUserProfileDTO.url;
          findContact.userProfileResponseDTO.about =
            updatedUserProfileDTO.about;
          findContact.userProfileResponseDTO.firstName =
            updatedUserProfileDTO.firstName;
          newPrivacySettings = {
            contactsDTO: {
              contact: { ...findContact.contactsDTO },
              userProfileResponseDTO: { ...findContact.userProfileResponseDTO },
            },
          };
        }
      }
    );
  }

  initChatWebSocket() {
    this.webSocketManagerChat.connectWebSocket(
      () => {
        this.subscribeToChatChannels();
      },
      function (error) {
        console.error("Chat WebSocket connection error: " + error);
      }
    );
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
    const disconnect = `/user/${this.user.id}/queue/disconnect`;

    this.webSocketManagerChat.subscribeToChannel(disconnect, async () => {
      await this.logout();
    });
    this.webSocketManagerChat.subscribeToChannel(
      `/user/${this.userId}/queue/error`,
      (message) => {
        try {
          const errorPayload = JSON.parse(message.body);
          console.error("WebSocket Error:", errorPayload);
        } catch (e) {
          console.error("WebSocket Error (raw):", message.body);
        }
      }
    );
    this.webSocketManagerChat.subscribeToChannel(
      error,
      async (errorMessageDTO) => {
        const errorMessage = JSON.parse(errorMessageDTO.body);
        toastr.error(errorMessage.message);
      }
    );

    this.webSocketManagerChat.subscribeToChannel(chatBlock, async (block) => {
      const blockData = JSON.parse(block.body);
      const chatData = this.chatList.find(
        (chat) => chat.chatDTO.id === blockData.chatRoomId
      );
      if (chatData) {
        chatData.userChatSettingsDTO.isBlockedMe = true;
      }
      if (isMessageBoxDomExists(chatData.chatDTO.id)) {
        const messageBoxElement = document.querySelector(".message-box");
        const statusSpan = messageBoxElement.querySelector(".online-status");
        if (statusSpan) {
          statusSpan.remove();
        }
        this.webSocketManagerChat.unsubscribeFromChannel(
          `/user/${chatData.userProfileResponseDTO.id}/queue/online-status`
        );
        this.webSocketManagerChat.unsubscribeFromChannel(
          `/user/${this.user.id}/queue/message-box-typing`
        );
      }
    });
    this.webSocketManagerChat.subscribeToChannel(
      chatUnBlock,
      async (unblock) => {
        const unblockData = JSON.parse(unblock.body);
        const chatData = this.chatList.find(
          (chat) => chat.chatDTO.id === unblockData.chatRoomId
        );
        if (chatData) {
          chatData.userChatSettingsDTO.isBlockedMe = false;
        }
        if (isMessageBoxDomExists(chatData.chatDTO.id)) {
          const messageBoxElement = document.querySelector(".message-box");
          const statusSpan = messageBoxElement.querySelector(".online-status");
          const messageBoxOnlineStatus =
            messageBoxElement.querySelector(".message-box1-2-2");
          if (statusSpan) {
            statusSpan.remove();
          }
          const chat = {
            userProfileResponseDTO: { ...chatData.userProfileResponseDTO },
            contactsDTO: { ...chatData.contactsDTO },
            userChatSettingsDTO: { ...chatData.userChatSettingsDTO },
          };
          await onlineInfo(chat, messageBoxOnlineStatus);
        }
      }
    );

    this.webSocketManagerChat.subscribeToChannel(
      readMessagesChannel,
      (readMessages) => {
        const readMessagesJSON = JSON.parse(readMessages.body);
        const firstReadMessage = readMessagesJSON[0];
        const messageBoxElement = document.querySelector(".message-box1");
        const chatBoxElements = [...document.querySelectorAll(".chat1")];
        const findChatElement = chatBoxElements.find(
          (chatElement) =>
            chatElement.chatData.chatDTO.id === firstReadMessage.chatRoomId
        );
        const findChat = this.chatList.find(
          (chat) => chat.chatDTO.id === firstReadMessage.chatRoomId
        );
        findChat.chatDTO.messages[0].isSeen = true;
        if (
          findChatElement &&
          this.user.privacySettings.readReceipts &&
          findChat.userProfileResponseDTO.privacySettings.readReceipts
        ) {
          const chatBoxElementDeliveredTick = findChatElement.querySelector(
            ".message-delivered-tick-div"
          ).firstElementChild;
          chatBoxElementDeliveredTick.className = "message-seen-tick-span";
          chatBoxElementDeliveredTick.ariaLabel = " Okundu ";
        }
        if (messageBoxElement) {
          const messageData = messageBoxElement.data;
          messageBoxElementMessagesReadTick(
            readMessagesJSON,
            messageData.userProfileResponseDTO.privacySettings
          );
        }
      }
    );
    this.webSocketManagerChat.subscribeToChannel(
      recipientMessageChannel,
      async (recipientMessage) => {
        const recipientJSON = JSON.parse(recipientMessage.body);
        const decryptedMessage = await decryptMessage(recipientJSON);
        recipientJSON.decryptedMessage = decryptedMessage;
        const chat = this.chatList.find(
          (chat) => chat.chatDTO.id === recipientJSON.chatRoomId
        );
        if (!chat) {
          await createChatBoxWithFirstMessage(recipientJSON);
        } else {
          const incomingMessage = new MessageDTO({
            ...recipientJSON,
            decryptedMessage,
          });
          chat.chatDTO.messages[0] = incomingMessage;
          chat.userChatSettingsDTO.unreadMessageCount =
            recipientJSON.unreadMessageCount;

          updateChatBox(chat);
          const chatElements = [...document.querySelectorAll(".chat1")];
          const chatElement = chatElements.find(
            (chat) => chat.chatData.chatDTO.id === recipientJSON.chatRoomId
          );

          let unreadMessageCountDiv;
          let chatOptionsDiv;
          if (chatElement) {
            chatOptionsDiv = chatElement.querySelector(".chat-options");
            const unreadMessageCountSpan = chatElement.querySelector(
              ".unread-message-count-span"
            );

            if (unreadMessageCountSpan) {
              unreadMessageCountSpan.textContent =
                recipientJSON.unreadMessageCount;
            } else {
              unreadMessageCountDiv = createElement(
                "div",
                "unread-message-count-div"
              );
              const unreadMessageCountSpan = createElement(
                "span",
                "unread-message-count-span",
                {},
                {
                  "aria-label": `${recipientJSON.unreadMessageCount} okunmamış mesaj`,
                },
                recipientJSON.unreadMessageCount
              );
              unreadMessageCountDiv.append(unreadMessageCountSpan);
              chatOptionsDiv.firstElementChild.append(unreadMessageCountDiv);
            }
            const messageTickSpan = chatElement.querySelector(
              ".message-delivered-tick-span"
            );
            if (messageTickSpan) {
              messageTickSpan.parentElement.remove();
            }
          }
          if (isMessageBoxDomExists(recipientJSON.chatRoomId)) {
            const dto = {
              recipientId: recipientJSON.recipientId,
              userChatSettingsId: chat.userChatSettingsDTO.id,
              chatRoomId: recipientJSON.chatRoomId,
              senderId: recipientJSON.senderId,
            };

            renderMessage(
              { messages: chat.chatDTO.messages[0], lastPage: null },
              chat.userProfileResponseDTO.privacySettings,
              true,
              this.user.id
            );
            chatInstance.webSocketManagerChat.sendMessageToAppChannel(
              "read-message",
              dto
            );
          }
          lastMessageChange(
            recipientJSON.chatRoomId,
            chatElement,
            decryptedMessage,
            recipientJSON.fullDateTime
          );
        }
      }
    );
    this.webSocketManagerChat.subscribeToChannel(
      typingChannel,
      async (typingMessage) => {
        debugger;
        const status = JSON.parse(typingMessage.body);
        const visibleChats = [...document.querySelectorAll(".chat1")];

        if (visibleChats) {
          const chat = visibleChats.find(
            (el) => el.chatData.chatDTO.id === status.chatRoomId
          );
          if (
            chat &&
            !chat.chatData.userChatSettingsDTO.isBlocked &&
            !chat.chatData.userChatSettingsDTO.isBlockedMe
          ) {
            const messageSpan = chat.querySelector(".message-span");
            const messageSpanSpan = chat.querySelector(".message-span-span");
            let tempMessage;

            if (status.typing) {
              messageSpanSpan.textContent = i18n.t("messageBox.typing");
            } else {
              if (chat.chatData.chatDTO.messages[0].senderId === this.user.id) {
                const messageDeliveredTickElement =
                  createMessageDeliveredTickElement();
                if (chat.chatData.chatDTO.isSeen) {
                  messageDeliveredTickElement.firstElementChild.className =
                    "message-seen-tick-span";
                  messageDeliveredTickElement.firstElementChild.ariaLabel =
                    " Okundu ";
                }
                messageSpan.prepend(messageDeliveredTickElement);
              }
              tempMessage =
                chat.chatData.chatDTO.messages[
                  chat.chatData.chatDTO.messages.length - 1
                ].decryptedMessage;
              messageSpanSpan.textContent = tempMessage;
            }
          }
        }
      }
    );
  }

  addEventListeners() {
    const addFriendButtonElement = document.querySelector(".add-friendd");
    const contactListButtonElement = document.querySelector(".friend-list-btn");
    const settingsBtnElement = document.querySelector(".settings-btn");
    const userProfileImageButton = document.querySelector(
      ".user-profile-photo"
    );
    const searchInput = document.querySelector(".css9");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.chatSearchHandler.handleSearch(e);
      });
    }

    if (userProfileImageButton) {
      userProfileImageButton.addEventListener("click", () => {
        userUpdateModal(this.user, true);
      });
    }

    if (addFriendButtonElement) {
      addFriendButtonElement.addEventListener("click", () => {
        addContactModal(chatInstance.user);
      });
    }

    if (contactListButtonElement) {
      contactListButtonElement.addEventListener("click", () => {
        renderContactList(this.contactList);
      });
    }

    if (settingsBtnElement) {
      settingsBtnElement.addEventListener("click", () => {
        createSettingsHtml();
      });
    }
  }

  async logout() {
    try {
      const response = await authService.logout();
      if (response && response.status === 200) {
        document.removeEventListener(
          "visibilitychange",
          this.handleVisibilityChange
        );
        window.removeEventListener("beforeunload", this.handleBeforeUnload);

        if (this.webSocketManagerContacts) {
          this.webSocketManagerContacts.disconnectWebSocket();
        }
        if (this.webSocketManagerChat) {
          this.stopPing();
          this.webSocketManagerChat.disconnectWebSocket();
        }

        await userService.updateUserLastSeen();

        sessionStorage.clear();

        navigateTo("/");
      } else {
        console.error("Logout failed, server returned:", response);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  startPing() {
    if (this.pingInterval) clearInterval(this.pingInterval);

    this.pingInterval = setInterval(() => {
      this.webSocketManagerChat.sendMessageToAppChannel("ping", {});
    }, this.pingFrequency);
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  handleVisibilityChange = async () => {
    if (document.hidden) {
      this.webSocketManagerChat.sendMessageToAppChannel("user-away", {});
      this.stopPing();
      await userService.updateUserLastSeen();
    } else {
      this.webSocketManagerChat.sendMessageToAppChannel("user-online", {});
      this.startPing();
    }
  };

  handleBeforeUnload = async () => {
    this.webSocketManagerChat.sendMessageToAppChannel("user-offline", {});
    userService.updateLastSeenOnExit();
  };
}

const handleLastSeenVisibilityChange = (user, newContactPrivacy) => {
  const messageBoxElement = document.querySelector(".message-box1");

  if (
    messageBoxElement &&
    messageBoxElement.data.userProfileResponseDTO.id ===
      newContactPrivacy.contactsDTO.userProfileResponseDTO.id
  ) {
    const statusElement = messageBoxElement.querySelector(".online-status");
    if (
      user.privacySettings.lastSeenVisibility === "EVERYONE" ||
      (newContactPrivacy.contactsDTO.contact.userHasAddedRelatedUser &&
        user.privacySettings.lastSeenVisibility === "CONTACTS")
    ) {
      if (
        newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings
          .lastSeenVisibility === "EVERYONE"
      ) {
        if (!statusElement) {
          const contactsOnlineStatusElement = isOnlineStatus(
            newContactPrivacy.contactsDTO.userProfileResponseDTO,
            newContactPrivacy.contactsDTO.contact
          );
          const onlineStatusParentElement =
            messageBoxElement.querySelector(".message-box1-2-2");
          if (contactsOnlineStatusElement && onlineStatusParentElement) {
            onlineStatusParentElement.append(contactsOnlineStatusElement);
          }
        }
      } else if (
        newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings
          .lastSeenVisibility === "CONTACTS" &&
        newContactPrivacy.contactsDTO.contact.relatedUserHasAddedUser
      ) {
        if (!statusElement) {
          const contactsOnlineStatusElement = isOnlineStatus(
            newContactPrivacy.contactsDTO.userProfileResponseDTO,
            newContactPrivacy.contactsDTO.contact
          );
          const onlineStatusParentElement =
            messageBoxElement.querySelector(".message-box1-2-2");
          if (contactsOnlineStatusElement && onlineStatusParentElement) {
            onlineStatusParentElement.append(contactsOnlineStatusElement);
          }
        }
      } else {
        if (
          statusElement &&
          newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings
            .onlineStatusVisibility !== "EVERYONE"
        ) {
          statusElement.remove();
        }
      }
    }
  }
};

const handleOnlineStatusVisibilityChange = (user, newContactPrivacy) => {
  const messageBoxElement = document.querySelector(".message-box1");

  if (
    messageBoxElement &&
    messageBoxElement.data.userProfileResponseDTO.id ===
      newContactPrivacy.contactsDTO.userProfileResponseDTO.id
  ) {
    const statusElement = messageBoxElement.querySelector(".online-status");
    if (
      user.privacySettings.onlineStatusVisibility === "EVERYONE" ||
      (newContactPrivacy.contactsDTO.contact.userHasAddedRelatedUser &&
        user.privacySettings.onlineStatusVisibility === "CONTACTS")
    ) {
      if (
        newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings
          .onlineStatusVisibility === "EVERYONE"
      ) {
        if (!statusElement) {
          const contactsOnlineStatusElement = isOnlineStatus(
            newContactPrivacy.contactsDTO.userProfileResponseDTO,
            newContactPrivacy.contactsDTO.contact
          );
          const onlineStatusParentElement =
            messageBoxElement.querySelector(".message-box1-2-2");
          if (contactsOnlineStatusElement && onlineStatusParentElement) {
            onlineStatusParentElement.append(contactsOnlineStatusElement);
          }
        }
      } else if (
        newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings
          .onlineStatusVisibility === "CONTACTS" &&
        newContactPrivacy.contactsDTO.contact.relatedUserHasAddedUser
      ) {
        if (!statusElement) {
          const contactsOnlineStatusElement = isOnlineStatus(
            newContactPrivacy.contactsDTO.userProfileResponseDTO,
            newContactPrivacy.contactsDTO.contact
          );
          const onlineStatusParentElement =
            messageBoxElement.querySelector(".message-box1-2-2");
          if (contactsOnlineStatusElement && onlineStatusParentElement) {
            onlineStatusParentElement.append(contactsOnlineStatusElement);
          }
        }
      } else {
        if (statusElement) {
          statusElement.remove();
        }
      }
    }
  }
};
const handleProfilePhotoVisibilityChange = (newValue, image) => {
  const visibleChatsElements = [...document.querySelectorAll(".chat1")];
  const visibleChatElement = visibleChatsElements.find(
    (chat) =>
      chat.chatData.userProfileResponseDTO.id ===
      newValue.userProfileResponseDTO.id
  );
  const bool =
    newValue.userProfileResponseDTO.privacySettings.profilePhotoVisibility ===
      "EVERYONE" ||
    (newValue.userProfileResponseDTO.privacySettings.profilePhotoVisibility ===
      "CONTACTS" &&
      newValue.contact.relatedUserHasAddedUser);
  if (visibleChatElement) {
    const imageElement = visibleChatElement.querySelector(".image");
    changesVisibilityProfilePhoto(bool, imageElement, image);
  }
  if (document.querySelector(".a1-1-1-1-1-1-3")) {
    const visibleContactsElements = [...document.querySelectorAll(".contact1")];
    const visibleContactElement = visibleContactsElements.find(
      (chat) =>
        chat.userProfileResponseDTO.id === newValue.userProfileResponseDTO.id
    );
    const imageElement = visibleContactElement?.querySelector(".image");
    changesVisibilityProfilePhoto(bool, imageElement, image);
  }
  const messageBoxElement = document.querySelector(".message-box1");
  if (
    messageBoxElement &&
    messageBoxElement.data.userProfileResponseDTO.id ===
      newValue.userProfileResponseDTO.id
  ) {
    const imageElement = messageBoxElement.querySelector(".message-box1-2-1-1");
    changesVisibilityProfilePhoto(bool, imageElement, image);
  }
};
const changesVisibilityProfilePhoto = (bool, imageElement, image) => {
  if (bool && imageElement && image) {
    if (imageElement.firstElementChild.className === "svg-div") {
      imageElement.removeChild(imageElement.firstElementChild);
      const imgElement = createElement(
        "img",
        "user-image",
        {},
        { src: `${image}`, alt: "", draggable: "false", tabindex: "-1" }
      );
      imageElement.append(imgElement);
    } else {
      imageElement.firstElementChild.src = image;
    }
  } else {
    if (imageElement?.firstElementChild.className === "user-image") {
      imageElement.removeChild(imageElement.firstElementChild);
      const svgDiv = createElement("div", "svg-div");

      const svgSpan = createElement(
        "span",
        "",
        {},
        { "aria-hidden": "true", "data-icon": "default-user" }
      );
      const svgElement = createSvgElement("svg", {
        class: "svg-element",
        viewBox: "0 0 212 212",
        height: "212",
        width: "212",
        preserveAspectRatio: "xMidYMid meet",
        version: "1.1",
        x: "0px",
        y: "0px",
        "enable-background": "new 0 0 212 212",
      });
      const titleElement = createSvgElement("title", {});
      titleElement.textContent = "default-user";
      const pathBackground = createSvgElement("path", {
        fill: "#DFE5E7",
        class: "background",
        d: "M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z",
      });
      const groupElement = createSvgElement("g", {});
      const pathPrimary1 = createSvgElement("path", {
        fill: "#FFFFFF",
        class: "primary",
        d: "M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z",
      });
      const pathPrimary2 = createSvgElement("path", {
        fill: "#FFFFFF",
        class: "primary",
        d: "M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z",
      });

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
};

const handleAboutVisibilityChange = (newValue) => {
  const bool =
    newValue.userProfileResponseDTO.privacySettings.aboutVisibility ===
      "EVERYONE" ||
    (newValue.userProfileResponseDTO.privacySettings.aboutVisibility ===
      "CONTACTS" &&
      newValue.contact.userHasAddedRelatedUser);
  if (document.querySelector(".a1-1-1-1-1-1-3")) {
    const visibleContactsElements = [...document.querySelectorAll(".contact1")];
    const visibleContactElement = visibleContactsElements.find(
      (chat) =>
        chat.userProfileResponseDTO.id === newValue.userProfileResponseDTO.id
    );
    const aboutElement = visibleContactElement?.querySelector(".message");
    changesVisibilityAbout(
      bool,
      aboutElement,
      newValue.userProfileResponseDTO.about
    );
  }
};
const changesVisibilityAbout = (bool, aboutElement, about) => {
  if (bool) {
    if (aboutElement) {
      if (!aboutElement.firstElementChild) {
        const messageSpan = createElement(
          "span",
          "message-span",
          {},
          { title: "" }
        );
        aboutElement.append(messageSpan);
        const innerSpan = createElement(
          "span",
          "message-span-span",
          {},
          { dir: "ltr", "aria-label": "" },
          about
        );
        messageSpan.append(innerSpan);
      }
    }
  } else {
    if (aboutElement && aboutElement.firstElementChild) {
      aboutElement.removeChild(aboutElement.firstElementChild);
    }
  }
};

export class UserSettingsDTO {
  constructor({
    friendId = "",
    userId = "",
    id = "",
    userChatSettingsDTO = {},
    friendEmail = "",
  } = {}) {
    this.userChatSettingsDTO = userChatSettingsDTO;
    this.userId = userId;
    this.id = id;
    this.friendEmail = friendEmail;
    this.friendId = friendId;
  }
}
