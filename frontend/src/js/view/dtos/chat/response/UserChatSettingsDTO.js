export class UserChatSettingsDTO {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.chatUserId = data.chatUserId;
    this.chatRoomId = data.chatRoomId;
    this.unreadMessageCount = data.unreadMessageCount;
    this.isArchived = data.isArchived;
    this.isPinned = data.isPinned;
    this.isBlocked = data.isBlocked;
    this.isBlockedMe = data.isBlockedMe;
    this.deletedTime = data.deletedTime ? new Date(data.deletedTime) : null;
    this.blockedTime = data.blockedTime ? new Date(data.blockedTime) : null;
    this.unblockedTime = data.unblockedTime ? new Date(data.unblockedTime) : null;
  }
}