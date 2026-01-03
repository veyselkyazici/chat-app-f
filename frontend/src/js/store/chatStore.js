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

  setUser(user) {
    this.state.user = user;
  }

  get user() {
    return this.state.user;
  }

  setContactList(list) {
    this.state.contactList = list;
  }

  get contactList() {
    return this.state.contactList;
  }

  setChatList(list) {
    this.state.chatList = list;
  }

  updateChatSummary(chatRoomId, summaryDTO) {
    const idx = this.state.chatList.findIndex(
      (c) => c.chatDTO.id === chatRoomId
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

  set selectedChatUserId(value) {
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
}

export const chatStore = new ChatStore();
