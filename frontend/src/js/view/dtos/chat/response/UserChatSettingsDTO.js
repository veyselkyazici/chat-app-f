export class UserChatSettingsDTO {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.chatRoomId = data.chatRoomId;
    this.unreadMessageCount = data.unreadMessageCount;
    this.isArchived = data.archived ?? data.isArchived;
    this.isPinned = data.pinned ?? data.isPinned;
    this.isBlocked = data.blocked ?? data.isBlocked;
    this.isBlockedMe = data.blockedMe ?? data.isBlockedMe;
    this.deletedTime = data.deletedTime ? new Date(data.deletedTime) : null;
    this.blockedTime = data.blockedTime ? new Date(data.blockedTime) : null;
    this.unblockedTime = data.unblockedTime ? new Date(data.unblockedTime) : null;
  }
}