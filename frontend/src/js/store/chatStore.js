

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
      updateItemsDTO: null,

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

  setUpdateItemsDTO(updateItemsDTO) {
    this.state.updateItemsDTO = updateItemsDTO;
  }

  get updateItemsDTO() {
    return this.state.updateItemsDTO;
  }
  setUser(user) {
    this.state.user = user;
  }

  get user() {
    return this.state.user;
  }

  setContactList(list) {
    const oldList = this.state.contactList;
    this.state.contactList = list || [];
    if (
      this.state.updateItemsDTO &&
      this.state.updateItemsDTO.list === oldList
    ) {
      this.state.updateItemsDTO.list = this.state.contactList;
    }
  }

  get contactList() {
    return this.state.contactList;
  }

  setChatList(list) {
    const oldList = this.state.chatList;
    this.state.chatList = list || [];
    if (
      this.state.updateItemsDTO &&
      this.state.updateItemsDTO.list === oldList
    ) {
      this.state.updateItemsDTO.list = this.state.chatList;
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
