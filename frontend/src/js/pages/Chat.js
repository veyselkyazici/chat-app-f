// Chat.js
import AbstractView from "./AbstractView.js";
import renderContactList from "../components/Contacts.js";
import { createSettingsHtml } from "../components/Settings.js";
import { addContactModal } from "../components/AddContact.js";
import { SearchHandler } from "../utils/searchHandler.js";
import {
  createElement,
  createSvgElement,
  createProfileImage,
  handleErrorCode,
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
import { authService } from "../services/authService.js";
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
import { i18n } from "../i18n/i18n.js";
import { webSocketService } from "../websocket/websocketService.js";
import { chatStore } from "../store/chatStore.js";

export default class Chat extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Chat");
    this.chatSearchHandler = null;
  }

  async getHtml() {
    return `<div class="overlay-spinner hidden">
  <div class="spinner"></div>
</div><div id="chat-loading-screen" class="chat-loading-screen"><span></span><div class="loading-container"><div class="loading-logo"><div class="whatsapp-logo"><i class="fas fa-comments fa-2x"></i></div></div><div class="loading-text"><p>Please wait</p></div><div class="loading-spinner"><div class="spinner"></div></div></div></div><span class></span><span class></span><span class></span><div class="chat-container"><div class="xixxii4"></div><div class="a1"><div class="a1-1"><span class="a1-1-1"></span></div><div class="a1-2"><span class="a1-2-1"></span></div></div><div class="chats"><header><header class="chat-list-header"><div class="user-photo">
<div class="user-profile-photo"  style="height: 49px; width: 49px;" role="button"><div class="svg-div"><span class="" aria-hidden="true" data-icon="default-user"><svg class="svg-element" viewBox="0 0 212 212" height="212" width="212" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 212 212"><title>default-user</title><path fill="#DFE5E7" class="background" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g><path fill="#FFFFFF" class="primary" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" class="primary" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path></g></svg></span></div></div>
</div><div class="options-div"><div class="options"><div class="friend-list-btn option" tabindex="0" role="button" title="Yeni Sohbet Başlat" aria-label="Yeni Sohbet Başlat"><span class="friend-list-icon option material-symbols-outlined">chat_add_on</span></div><div class="add-friendd option" tabindex="0" role="button" title=${i18n.t(
      "addContacts.addContact"
    )} aria-label="Add contact"><i class="fa-solid fa-plus"></i></div><div class="settings-btn option" tabindex="0" role="button" title="Options" aria-label="Options"> <i class="fa-solid fa-gear"></i></div></div></div></header></header><div class="chat-content side">
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
      await this.initialData();
      this.chatSearchInit();
      this.hideLoadingScreen();
    } catch (error) {
      console.error(error);
      this.updateLoadingProgress(i18n.t("chat.loadingErrorMessage"));
    }
  }

  async initialData() {
    const storageId = sessionStorage.getItem("id");
    const response = await userService.getUserWithUserKeyByAuthId(storageId);

    chatStore.setUser(response.data);

    if (!chatStore.user) {
      return navigateTo("/login");
    }

    this.initializeWebSockets();

    if (chatStore.user.updatedAt == null) {
      this.hideLoadingScreen();
      userUpdateModal(chatStore.user, false);
    }

    if (!getUserKey()) {
      try {
        await this.handleMissingUserKey();
      } catch (err) {
        console.error("Session restore error:", err);
        return navigateTo("/login");
      }
    }

    if (chatStore.user.imagee) {
      const image = createProfileImage(chatStore.user);
      const userProfile = document.querySelector(".user-profile-photo");
      userProfile.firstChild.remove();
      userProfile.append(image);
    }

    await this.getContactList();
    await this.getChatList();
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

      const decrypted = await decryptWithSessionKey(
        base64ToUint8Array(storedEncryptedPrivateKey),
        base64ToUint8Array(storedIv)
      );

      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        decrypted,
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
    const list = await contactService.getContactList(chatStore.user.id);

    chatStore.setContactList(list.map((item) => new ContactResponseDTO(item)));
  }

  async getChatList() {
    const summaries = await chatService.getChatSummaries();

    const finalList = await Promise.all(
      summaries.map(async (item) => {
        const isSender =
          item.chatDTO.messages[0].senderId === chatStore.user.id;

        item.chatDTO.messages[0].decryptedMessage = await decryptMessage(
          item.chatDTO.messages[0],
          isSender
        );

        return new ChatSummaryDTO(item);
      })
    );

    chatStore.setChatList(finalList);

    await handleChats(chatStore.chatList);
  }
  initializeWebSockets() {
    webSocketService.init();

    const chatWS = webSocketService.chatWS;
    const contactsWS = webSocketService.contactsWS;

    chatStore.setWebSocketManagers(chatWS, contactsWS);

    chatWS.connect(() => {
      this.subscribeToChatChannels();
      this.handleOnline();
    });

    contactsWS.connect(() => {
      this.subscribeToFriendshipChannels();
    });

    chatWS.onDisconnect(() => this.handleOffline());
    contactsWS.onDisconnect(() => this.handleOffline());

    this.visibilityHandlers();
  }

  chatSearchInit() {
    this.chatSearchHandler = new SearchHandler({
      listData: chatStore.chatList,
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

  updateLoadingProgress(text) {
    const loadingText = document.querySelector(".loading-text p");
    if (loadingText) loadingText.textContent = text;
  }

  subscribeToFriendshipChannels() {
    const contactsWS = chatStore.contactsWS;

    const addContact = `/user/queue/add-contact`;
    const addContactUser = `/user/queue/add-contact-user`;
    const addInvitation = `/user/queue/add-invitation`;
    const updatePrivacy = `/user/queue/updated-privacy-response`;
    const updatedUserProfile = `/user/queue/updated-user-profile-message`;
    const disconnect = `/user/queue/disconnect`;
    const invitedUserJoined = `/user/queue/invited-user-joined`;

    // invited-user-joined
    contactsWS.subscribe(invitedUserJoined, async (msg) => {
      const dto = new ContactResponseDTO(JSON.parse(msg.body));

      // 1) varolan invitation'lardan sil
      let updatedList = chatStore.contactList.filter((c) => {
        if (c.contactsDTO) return true;
        return (
          c.invitationResponseDTO?.inviteeEmail !==
          dto.userProfileResponseDTO.email
        );
      });

      // 2) doğru yere ekle
      let inserted = false;
      const newName = dto.contactsDTO.userContactName;

      for (let i = 0; i < updatedList.length; i++) {
        const cur = updatedList[i];
        if (
          cur.contactsDTO &&
          newName.localeCompare(cur.contactsDTO.userContactName) < 0
        ) {
          updatedList.splice(i, 0, dto);
          inserted = true;
          break;
        }
      }
      if (!inserted) updatedList.push(dto);

      chatStore.setContactList(updatedList);
    });

    // disconnect → logout
    contactsWS.subscribe(disconnect, async () => {
      await this.logout();
    });

    // error
    contactsWS.subscribe(`/user/queue/error`, (msg) => {
      try {
        console.error("❌ WS Error:", JSON.parse(msg.body));
      } catch {
        console.error("❌ WS Error (raw):", msg.body);
      }
    });

    // add-contact
    contactsWS.subscribe(addContact, async (msg) => {
      const newContact = JSON.parse(msg.body);

      // chat list içindeki adı güncelle
      const updatedChatList = chatStore.chatList.map((chat) => {
        if (
          chat.userProfileResponseDTO.id ===
          newContact.userProfileResponseDTO.id
        ) {
          chat.contactsDTO.userContactName =
            newContact.contactsDTO.userContactName;
          chat.contactsDTO.userHasAddedRelatedUser = true;
        }
        return chat;
      });

      chatStore.setChatList(updatedChatList);

      // Contact list sıralama
      let contactIdList = chatStore.contactList.filter((c) => c.id);
      const index = contactIdList.findIndex((c) => {
        return (
          c.userContactName.localeCompare(
            newContact.userContactName,
            undefined,
            { sensitivity: "base" }
          ) > 0
        );
      });

      if (index === -1) {
        contactIdList.push(newContact);
      } else {
        contactIdList.splice(index, 0, newContact);
      }

      const invitations = chatStore.contactList.filter((c) => !c.id);
      chatStore.setContactList([...contactIdList, ...invitations]);
    });

    // add-contact-user (karşı taraf seni ekledi)
    contactsWS.subscribe(addContactUser, async (msg) => {
      const newContact = JSON.parse(msg.body);

      const updatedChats = chatStore.chatList.map((chat) => {
        if (chat.userProfileResponseDTO.id === newContact.contactsDTO.userId) {
          chat.contactsDTO.relatedUserHasAddedUser =
            newContact.contactsDTO.userHasAddedRelatedUser;

          chat.userProfileResponseDTO.imagee =
            newContact.userProfileResponseDTO.imagee;

          if (chat.userProfileResponseDTO.imagee) {
            handleProfilePhotoVisibilityChange(
              {
                contact: { ...chat.contactsDTO },
                userProfileResponseDTO: { ...chat.userProfileResponseDTO },
              },
              chat.userProfileResponseDTO.imagee
            );
          }
        }
        return chat;
      });

      chatStore.setChatList(updatedChats);

      const updatedContacts = chatStore.contactList.map((contact) => {
        if (
          contact.userProfileResponseDTO.id === newContact.contactsDTO.userId
        ) {
          contact.contactsDTO.relatedUserHasAddedUser =
            newContact.contactsDTO.userHasAddedRelatedUser;

          contact.userProfileResponseDTO.imagee =
            newContact.userProfileResponseDTO.imagee;

          if (contact.userProfileResponseDTO.imagee) {
            handleProfilePhotoVisibilityChange(
              {
                contact: { ...contact.contactsDTO },
                userProfileResponseDTO: {
                  ...contact.userProfileResponseDTO,
                },
              },
              contact.userProfileResponseDTO.imagee
            );
          }
        }
        return contact;
      });

      chatStore.setContactList(updatedContacts);
    });

    // add-invitation
    contactsWS.subscribe(addInvitation, async (msg) => {
      const newInvitation = JSON.parse(msg.body);

      let invitations = chatStore.contactList.filter(
        (c) => c.invitationResponseDTO
      );

      const idx = invitations.findIndex((inv) => {
        return (
          inv.invitationResponseDTO.contactName.localeCompare(
            newInvitation.invitationResponseDTO.contactName,
            undefined,
            { sensitivity: "base" }
          ) > 0
        );
      });

      if (idx === -1) invitations.push(newInvitation);
      else invitations.splice(idx, 0, newInvitation);

      const contacts = chatStore.contactList.filter((c) => c.contactsDTO);
      chatStore.setContactList([...contacts, ...invitations]);
    });

    // update-privacy
    contactsWS.subscribe(updatePrivacy, async (msg) => {
      const dto = JSON.parse(msg.body);

      const chats = chatStore.chatList.map((chat) => {
        if (chat.userProfileResponseDTO.id === dto.id) {
          const old = chat.userProfileResponseDTO.privacySettings;
          chat.userProfileResponseDTO = dto;

          if (
            old.profilePhotoVisibility !==
            dto.privacySettings.profilePhotoVisibility
          ) {
            handleProfilePhotoVisibilityChange(
              { contact: { ...chat.contactsDTO }, userProfileResponseDTO: dto },
              dto.imagee
            );
          }

          if (
            old.onlineStatusVisibility !==
            dto.privacySettings.onlineStatusVisibility
          ) {
            handleOnlineStatusVisibilityChange(chatStore.user, {
              contactsDTO: {
                contact: chat.contactsDTO,
                userProfileResponseDTO: dto,
              },
            });
          }

          if (
            old.lastSeenVisibility !== dto.privacySettings.lastSeenVisibility
          ) {
            handleLastSeenVisibilityChange(chatStore.user, {
              contactsDTO: {
                contact: chat.contactsDTO,
                userProfileResponseDTO: dto,
              },
            });
          }
        }
        return chat;
      });

      chatStore.setChatList(chats);

      const contacts = chatStore.contactList.map((c) => {
        if (c.userProfileResponseDTO?.id === dto.id) {
          const old = c.userProfileResponseDTO.privacySettings;
          c.userProfileResponseDTO = dto;

          if (old.aboutVisibility !== dto.privacySettings.aboutVisibility) {
            handleAboutVisibilityChange({
              contact: c.contactsDTO,
              userProfileResponseDTO: dto,
            });
          }
        }
        return c;
      });

      chatStore.setContactList(contacts);
    });

    // updated-user-profile
    contactsWS.subscribe(updatedUserProfile, async (msg) => {
      const dto = JSON.parse(msg.body);

      const chats = chatStore.chatList.map((chat) => {
        if (chat.userProfileResponseDTO.id === dto.userId) {
          chat.userProfileResponseDTO.imagee = dto.url;
          chat.userProfileResponseDTO.about = dto.about;
          chat.userProfileResponseDTO.firstName = dto.firstName;

          handleProfilePhotoVisibilityChange(
            {
              contact: chat.contactsDTO,
              userProfileResponseDTO: chat.userProfileResponseDTO,
            },
            chat.userProfileResponseDTO.imagee
          );
        }
        return chat;
      });

      chatStore.setChatList(chats);

      const contacts = chatStore.contactList.map((contact) => {
        if (contact.userProfileResponseDTO?.id === dto.userId) {
          contact.userProfileResponseDTO.imagee = dto.url;
          contact.userProfileResponseDTO.about = dto.about;
          contact.userProfileResponseDTO.firstName = dto.firstName;
        }
        return contact;
      });

      chatStore.setContactList(contacts);
    });
  }

  subscribeToChatChannels() {
    const chatWS = chatStore.chatWS;

    const recipientMessageChannel = `/user/queue/received-message`;
    const typingChannel = `/user/queue/typing`;
    const readMessagesChannel = `/user/queue/read-messages`;
    const chatBlock = `/user/queue/block`;
    const chatUnBlock = `/user/queue/unblock`;
    const error = `/user/queue/error-message`;
    const disconnect = `/user/queue/disconnect`;

    chatWS.subscribe(disconnect, async () => this.logout());

    chatWS.subscribe(`/user/queue/error`, (msg) => {
      try {
        console.error("WS error:", JSON.parse(msg.body));
      } catch {
        console.error("WS error(raw):", msg.body);
      }
    });

    chatWS.subscribe(error, (msg) => {
      const err = JSON.parse(msg.body);
      handleErrorCode(err.code, null, i18n);
    });

    // BLOCK
    chatWS.subscribe(chatBlock, async (msg) => {
      const dto = JSON.parse(msg.body);

      const updated = chatStore.chatList.map((chat) => {
        if (chat.chatDTO.id === dto.chatRoomId) {
          chat.userChatSettingsDTO.isBlockedMe = true;
        }
        return chat;
      });

      chatStore.setChatList(updated);

      if (isMessageBoxDomExists(dto.chatRoomId)) {
        const box = document.querySelector(".message-box");
        const statusSpan = box.querySelector(".online-status");
        if (statusSpan) statusSpan.remove();

        chatStore.contactsWS.unsubscribe(`/user/queue/online-status`);
        chatStore.chatWS.unsubscribe(`/user/queue/message-box-typing`);
      }
    });

    // UNBLOCK
    chatWS.subscribe(chatUnBlock, async (msg) => {
      const dto = JSON.parse(msg.body);

      const updated = chatStore.chatList.map((chat) => {
        if (chat.chatDTO.id === dto.chatRoomId) {
          chat.userChatSettingsDTO.isBlockedMe = false;
        }
        return chat;
      });

      chatStore.setChatList(updated);

      if (isMessageBoxDomExists(dto.chatRoomId)) {
        const messageBoxElement = document.querySelector(".message-box");
        const statusSpan = messageBoxElement.querySelector(".online-status");
        if (statusSpan) statusSpan.remove();

        const chatData = updated.find((c) => c.chatDTO.id === dto.chatRoomId);

        await onlineInfo(chatData, messageBoxElement);
      }
    });

    // READ MESSAGES
    chatWS.subscribe(readMessagesChannel, (msg) => {
      const json = JSON.parse(msg.body);

      const first = json[0];

      const updated = chatStore.chatList.map((chat) => {
        if (chat.chatDTO.id === first.chatRoomId) {
          chat.chatDTO.messages[0].isSeen = true;
        }
        return chat;
      });

      chatStore.setChatList(updated);

      const messageBox = document.querySelector(".message-box1");
      if (messageBox) {
        messageBoxElementMessagesReadTick(
          json,
          messageBox.data.userProfileResponseDTO.privacySettings
        );
      }
    });

    // RECEIVED MESSAGE
    chatWS.subscribe(recipientMessageChannel, async (msg) => {
      const dto = JSON.parse(msg.body);

      dto.decryptedMessage = await decryptMessage(dto);

      let chat = chatStore.chatList.find(
        (c) => c.chatDTO.id === dto.chatRoomId
      );

      if (!chat) {
        await createChatBoxWithFirstMessage(dto);
        return;
      }

      const incoming = new MessageDTO({ ...dto });

      chat.chatDTO.messages[0] = incoming;
      chat.userChatSettingsDTO.unreadMessageCount = dto.unreadMessageCount;

      updateChatBox(chat);

      const chatElements = [...document.querySelectorAll(".chat1")];
      const chatElement = chatElements.find(
        (el) => el.chatData.chatDTO.id === dto.chatRoomId
      );

      // unread badge update
      if (chatElement) {
        const options = chatElement.querySelector(".chat-options");
        const span = chatElement.querySelector(".unread-message-count-span");

        if (span) {
          span.textContent = dto.unreadMessageCount;
        } else {
          const div = createElement("div", "unread-message-count-div");
          const spanNew = createElement(
            "span",
            "unread-message-count-span",
            {},
            { "aria-label": `${dto.unreadMessageCount} unread messages` },
            dto.unreadMessageCount
          );
          div.append(spanNew);
          options.firstElementChild.append(div);
        }
      }

      // message box açıkken read-message gönder
      if (isMessageBoxDomExists(dto.chatRoomId)) {
        const msgDto = {
          recipientId: dto.recipientId,
          userChatSettingsId: chat.userChatSettingsDTO.id,
          chatRoomId: dto.chatRoomId,
          senderId: dto.senderId,
        };

        renderMessage(
          { messages: incoming, lastPage: null },
          chat.userProfileResponseDTO.privacySettings,
          true,
          chatStore.user.id
        );

        chatStore.chatWS.send("read-message", msgDto);
      }

      lastMessageChange(
        dto.chatRoomId,
        chatElement,
        dto.decryptedMessage,
        dto.fullDateTime
      );
    });

    // TYPING
    chatWS.subscribe(typingChannel, async (msg) => {
      const status = JSON.parse(msg.body);

      const visible = [...document.querySelectorAll(".chat1")];
      const chatElement = visible.find(
        (el) => el.chatData.chatDTO.id === status.chatRoomId
      );

      if (!chatElement) return;

      const chat = chatElement.chatData;
      if (
        chat.userChatSettingsDTO.isBlocked ||
        chat.userChatSettingsDTO.isBlockedMe
      )
        return;

      const messageSpan = chatElement.querySelector(".message-span");
      const messageText = chatElement.querySelector(".message-span-span");

      const lastMsg = chat.chatDTO.messages[chat.chatDTO.messages.length - 1];

      const isSender = lastMsg.senderId === chatStore.user.id;

      if (status.typing) {
        if (isSender) {
          messageSpan.removeChild(messageSpan.firstElementChild);
        }
        messageText.textContent = i18n.t("messageBox.typing");
      } else {
        if (isSender) {
          const tick = createMessageDeliveredTickElement();
          if (lastMsg.isSeen) {
            tick.firstElementChild.className = "message-seen-tick-span";
            tick.firstElementChild.ariaLabel = "Seen";
          }
          messageSpan.prepend(tick);
        }

        messageText.textContent =
          lastMsg.decryptedMessage ?? (await decryptMessage(lastMsg, isSender));
      }
    });
  }

  addEventListeners() {
    const addFriendButton = document.querySelector(".add-friendd");
    const contactListButton = document.querySelector(".friend-list-btn");
    const settingsButton = document.querySelector(".settings-btn");
    const profilePhotoButton = document.querySelector(".user-profile-photo");
    const searchInput = document.querySelector(".css9");

    // Search
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.chatSearchHandler.handleSearch(e);
      });
    }

    // Profile modal
    if (profilePhotoButton) {
      profilePhotoButton.addEventListener("click", () => {
        userUpdateModal(chatStore.user, true);
      });
    }

    // Add friend modal
    if (addFriendButton) {
      addFriendButton.addEventListener("click", () => {
        addContactModal(chatStore.user); // ← user store'dan geliyor
      });
    }

    // Contact list
    if (contactListButton) {
      contactListButton.addEventListener("click", () => {
        renderContactList(chatStore.contactList);
      });
    }

    // Settings
    if (settingsButton) {
      settingsButton.addEventListener("click", () => {
        createSettingsHtml();
      });
    }
  }

  async logout() {
    const overlay = document.querySelector(".overlay-spinner");
    overlay.classList.remove("hidden");

    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout error:", e);
    }

    try {
      chatStore.chatWS?.disconnect();
      chatStore.contactsWS?.disconnect();
    } catch {}

    sessionStorage.clear();

    overlay.classList.add("hidden");

    navigateTo("/login");
  }

  visibilityHandlers() {
    if (window.__chatVisibilityBound) return;
    window.__chatVisibilityBound = true;

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.handleAway();
      else this.handleOnline();
    });

    window.addEventListener("focus", () => this.handleOnline());
    window.addEventListener("blur", () => this.handleAway());

    window.addEventListener("beforeunload", () => {
      try {
        this.handleOffline();
      } catch {}

      try {
        chatStore.chatWS?.disconnect();
      } catch {}

      try {
        chatStore.contactsWS?.disconnect();
      } catch {}

      // const access = sessionStorage.getItem("access_token");
      // if (access) {
      //   navigator.sendBeacon(
      //     `${AUTH_SERVICE_URL}/logout`,
      //     JSON.stringify({ token: access })
      //   );
      // }
    });
  }

  sendStatus(status) {
    if (chatStore.lastUserStatus === status) return;

    chatStore.setLastUserStatus(status);

    chatStore.contactsWS?.send("/user-status", { status });
  }

  handleOnline() {
    if (!chatStore.contactsWS?.isConnected) return;
    this.sendStatus("online");
  }

  handleAway() {
    if (!chatStore.contactsWS?.isConnected) return;
    this.sendStatus("away");
  }

  handleOffline() {
    if (!chatStore.contactsWS?.isConnected) return;
    this.sendStatus("offline");
  }
}

export const handleLastSeenVisibilityChange = (newContactPrivacy) => {
  const user = chatStore.user;

  const messageBoxElement = document.querySelector(".message-box1");
  if (
    messageBoxElement &&
    messageBoxElement.data.userProfileResponseDTO.id ===
      newContactPrivacy.contactsDTO.userProfileResponseDTO.id
  ) {
    const statusElement = messageBoxElement.querySelector(".online-status");

    const showForUser =
      user.privacySettings.lastSeenVisibility === "EVERYONE" ||
      (newContactPrivacy.contactsDTO.contact.userHasAddedRelatedUser &&
        user.privacySettings.lastSeenVisibility === "CONTACTS");

    if (showForUser) {
      const contactPrivacy =
        newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings;

      const allow =
        contactPrivacy.lastSeenVisibility === "EVERYONE" ||
        (contactPrivacy.lastSeenVisibility === "CONTACTS" &&
          newContactPrivacy.contactsDTO.contact.relatedUserHasAddedUser);

      if (allow) {
        if (!statusElement) {
          isOnlineStatus(
            newContactPrivacy.contactsDTO.userProfileResponseDTO,
            newContactPrivacy.contactsDTO.contact
          );
        }
      } else {
        statusElement?.remove();
      }
    }
  }
};


export const handleOnlineStatusVisibilityChange = (newContactPrivacy) => {
  const user = chatStore.user;

  const messageBoxElement = document.querySelector(".message-box1");
  if (
    messageBoxElement &&
    messageBoxElement.data.userProfileResponseDTO.id ===
      newContactPrivacy.contactsDTO.userProfileResponseDTO.id
  ) {
    const statusElement = messageBoxElement.querySelector(".online-status");

    const showForUser =
      user.privacySettings.onlineStatusVisibility === "EVERYONE" ||
      (newContactPrivacy.contactsDTO.contact.userHasAddedRelatedUser &&
        user.privacySettings.onlineStatusVisibility === "CONTACTS");

    if (showForUser) {
      const contactPrivacy =
        newContactPrivacy.contactsDTO.userProfileResponseDTO.privacySettings;

      const allow =
        contactPrivacy.onlineStatusVisibility === "EVERYONE" ||
        (contactPrivacy.onlineStatusVisibility === "CONTACTS" &&
          newContactPrivacy.contactsDTO.contact.relatedUserHasAddedUser);

      if (allow) {
        if (!statusElement) {
          isOnlineStatus(
            newContactPrivacy.contactsDTO.userProfileResponseDTO,
            newContactPrivacy.contactsDTO.contact
          );
        }
      } else {
        statusElement?.remove();
      }
    }
  }
};


export const handleProfilePhotoVisibilityChange = (newValue, image) => {
  const privacy =
    newValue.userProfileResponseDTO.privacySettings.profilePhotoVisibility;

  const bool =
    privacy === "EVERYONE" ||
    (privacy === "CONTACTS" && newValue.contact.relatedUserHasAddedUser);

  // CHAT LIST
  const visibleChats = [...document.querySelectorAll(".chat1")];
  const chatElement = visibleChats.find(
    (chat) =>
      chat.chatData.userProfileResponseDTO.id ===
      newValue.userProfileResponseDTO.id
  );
  if (chatElement) {
    const imageElement = chatElement.querySelector(".image");
    changesVisibilityProfilePhoto(bool, imageElement, image);
  }

  // CONTACT LIST
  if (document.querySelector(".a1-1-1-1-1-1-3")) {
    const visibleContacts = [...document.querySelectorAll(".contact1")];
    const contact = visibleContacts.find(
      (c) => c.userProfileResponseDTO.id === newValue.userProfileResponseDTO.id
    );
    const imageElement = contact?.querySelector(".image");
    changesVisibilityProfilePhoto(bool, imageElement, image);
  }

  // MESSAGE BOX
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

export const changesVisibilityProfilePhoto = (bool, imageElement, image) => {
  if (!imageElement) return;

  if (bool && image) {
    // göster
    if (imageElement.firstElementChild?.className === "svg-div") {
      imageElement.removeChild(imageElement.firstElementChild);

      const img = createElement(
        "img",
        "user-image",
        {},
        { src: image, draggable: "false", tabindex: "-1", alt: "" }
      );
      imageElement.append(img);
    } else {
      imageElement.firstElementChild.src = image;
    }
  } else {
    if (imageElement.firstElementChild?.className === "user-image") {
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
      });

      svgSpan.append(svgElement);
      svgDiv.append(svgSpan);
      imageElement.append(svgDiv);
    }
  }
};

export const handleAboutVisibilityChange = (newValue) => {
  const privacy =
    newValue.userProfileResponseDTO.privacySettings.aboutVisibility;

  const bool =
    privacy === "EVERYONE" ||
    (privacy === "CONTACTS" && newValue.contact.userHasAddedRelatedUser);

  if (document.querySelector(".a1-1-1-1-1-1-3")) {
    const visibleContacts = [...document.querySelectorAll(".contact1")];
    const contact = visibleContacts.find(
      (c) => c.userProfileResponseDTO.id === newValue.userProfileResponseDTO.id
    );
    const aboutElement = contact?.querySelector(".message");
    changesVisibilityAbout(
      bool,
      aboutElement,
      newValue.userProfileResponseDTO.about
    );
  }
};

export const changesVisibilityAbout = (bool, element, about) => {
  if (!element) return;

  if (bool) {
    if (!element.firstElementChild) {
      const span = createElement("span", "message-span");
      const inner = createElement(
        "span",
        "message-span-span",
        {},
        { dir: "ltr" },
        about
      );
      span.append(inner);
      element.append(span);
    }
  } else {
    if (element.firstElementChild) {
      element.removeChild(element.firstElementChild);
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
