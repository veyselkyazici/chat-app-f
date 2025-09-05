export class UserChatSettingsDTO {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.chatRoomId = data.chatRoomId;
    this.unreadMessageCount = data.unreadMessageCount;
    this.isArchived = data.archived;
    this.isPinned = data.pinned;
    this.isBlocked = data.blocked;
    this.isBlockedMe = data.blockedMe;
    this.deletedTime = data.deletedTime ? new Date(data.deletedTime) : null;
    this.blockedTime = data.blockedTime ? new Date(data.blockedTime) : null;
    this.unblockedTime = data.unblockedTime ? new Date(data.unblockedTime) : null;
  }
}