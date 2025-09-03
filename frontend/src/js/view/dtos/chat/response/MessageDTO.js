

export class MessageDTO {
  constructor(data) {
    this.id = data.id;
    this.chatRoomId = data.chatRoomId;
    this.senderId = data.senderId;
    this.recipientId = data.recipientId;
    this.encryptedMessage = data.encryptedMessage;
    this.iv = data.iv;
    this.encryptedKeyForRecipient = data.encryptedKeyForRecipient;
    this.encryptedKeyForSender = data.encryptedKeyForSender;
    this.fullDateTime = data.fullDateTime ? new Date(data.fullDateTime) : null;
    this.isSeen = data.isSeen ?? false;
  }
}

