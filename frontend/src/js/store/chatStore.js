

class ChatStore {
  constructor() {
    this.state = {
      user: null,
      chatList: [],
      contactList: [],
      selectedChatUserId: null,
      visibleItemCount: 0,
      lastUserStatus: null,
      ws: null,
      chatUpdateItemsDTO: null,
      contactUpdateItemsDTO: null,

      activeChatRoomId: null,
      activeFriendId: null,
      activeChat: null,
      activeContact: null,
      messageBoxStatus: {
        typing: false,
        online: false,
        lastSeen: null,
        hidden: false,
      },
    };
    this.logoutHandler = null;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((callback) => callback(this.state));
  }

  updateUser(userData) {
    this.state.user = { ...this.state.user, ...userData };
    this.notify();
  }

  setLogoutHandler(cb) {
    this.logoutHandler = cb;
  }

  async logout() {
    if (this.logoutHandler) {
      return await this.logoutHandler();
    }
  }

  setMobileViewHandler(cb) {
    this.mobileViewHandler = cb;
  }

  setMobileView(viewName, pushState = true) {
    if (this.mobileViewHandler) {
      this.mobileViewHandler(viewName, pushState);
    }
  }

  setChatUpdateItemsDTO(chatUpdateItemsDTO) {
    this.state.chatUpdateItemsDTO = chatUpdateItemsDTO;
  }

  get chatUpdateItemsDTO() {
    return this.state.chatUpdateItemsDTO;
  }

  setContactUpdateItemsDTO(contactUpdateItemsDTO) {
    this.state.contactUpdateItemsDTO = contactUpdateItemsDTO;
  }

  get contactUpdateItemsDTO() {
    return this.state.contactUpdateItemsDTO;
  }

  setUser(user) {
    this.state.user = user;
    this.notify();
  }

  get user() {
    return this.state.user;
  }

  setContactList(list) {
    const oldList = this.state.contactList;
    this.state.contactList = list || [];
    if (
      this.state.contactUpdateItemsDTO &&
      this.state.contactUpdateItemsDTO.list === oldList
    ) {
      this.state.contactUpdateItemsDTO.list = this.state.contactList;
    }
  }

  get contactList() {
    return this.state.contactList;
  }

  setChatList(list) {
    const oldList = this.state.chatList;
    this.state.chatList = list || [];
    if (
      this.state.chatUpdateItemsDTO &&
      this.state.chatUpdateItemsDTO.list === oldList
    ) {
      this.state.chatUpdateItemsDTO.list = this.state.chatList;
    }
  }

  updateChatSummary(chatRoomId, summaryDTO) {
    const idx = this.state.chatList.findIndex(
      (c) => c.chatDTO.id === chatRoomId,
    );

    if (idx !== -1) {
      this.state.chatList[idx].chatDTO.messages[0] = summaryDTO;
    }
  }

  get chatList() {
    return this.state.chatList;
  }

  getLastMessage(chat) {
    if (!chat || !chat.chatDTO || !chat.chatDTO.messages || chat.chatDTO.messages.length === 0) {
      return null;
    }
    return chat.chatDTO.messages[chat.chatDTO.messages.length - 1];
  }

  get selectedChatUserId() {
    return this.state.selectedChatUserId;
  }

  setSelectedChatUserId(value) {
    this.state.selectedChatUserId = value;
  }
  setWebSocketManagers(ws) {
    this.state.ws = ws;
  }

  get ws() {
    return this.state.ws;
  }

  setLastUserStatus(status) {
    this.state.lastUserStatus = status;
  }

  get lastUserStatus() {
    return this.state.lastUserStatus;
  }

  setActiveMessageBox(chatData) {
    if (!chatData) {
      this.clearActiveMessageBox();
      return;
    }

    this.state.activeChat = chatData;

    this.state.activeChatRoomId = chatData.chatDTO?.id || null;
    this.state.activeFriendId = chatData.userProfileResponseDTO?.id || null;

    this.resetMessageBoxStatus();
  }

  setActiveContact(contactData) {
    this.state.activeContact = contactData;
  }

  get activeChat() {
    return this.state.activeChat;
  }

  get activeContact() {
    return this.state.activeContact;
  }

  get activeChatRoomId() {
    return this.state.activeChatRoomId;
  }

  get activeFriendId() {
    return this.state.activeFriendId;
  }

  clearActiveMessageBox() {
    this.state.activeChatRoomId = null;
    this.state.activeFriendId = null;
    this.state.activeChat = null;
    this.resetMessageBoxStatus();
  }

  resetMessageBoxStatus() {
    this.state.messageBoxStatus = {
      typing: false,
      online: false,
      lastSeen: null,
      hidden: false,
    };
  }

  applyPresence({ userId, status, lastSeen }) {
    if (!this.state.activeFriendId || userId !== this.state.activeFriendId)
      return;

    if (status === "hidden") {
      this.state.messageBoxStatus.hidden = true;
      this.state.messageBoxStatus.typing = false;
      this.state.messageBoxStatus.online = false;
      this.state.messageBoxStatus.lastSeen = null;
      return;
    }

    this.state.messageBoxStatus.hidden = false;

    if (status === "online") {
      this.state.messageBoxStatus.online = true;
      this.state.messageBoxStatus.lastSeen = null;
      return;
    }

    this.state.messageBoxStatus.online = false;
    this.state.messageBoxStatus.lastSeen = lastSeen ?? null;
  }

  applyTyping({ userId, chatRoomId, isTyping }) {
    if (!this.state.activeChatRoomId) {
      return;
    }
    if (chatRoomId !== this.state.activeChatRoomId) {
      return;
    }
    if (userId !== this.state.activeFriendId) {
      return;
    }
    if (this.state.messageBoxStatus.hidden) {
      return;
    }

    this.state.messageBoxStatus.typing = !!isTyping;
  }
}

export const chatStore = new ChatStore();
