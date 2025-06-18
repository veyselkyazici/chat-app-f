export class ChatDTO {
  constructor(data) {
    this.id = data.id;
    this.messageId = data.messageId;
    this.participantIds = data.participantIds;
    this.encryptedMessage = data.encryptedMessage;
    this.iv = data.iv;
    this.encryptedKeyForRecipient = data.encryptedKeyForRecipient;
    this.encryptedKeyForSender = data.encryptedKeyForSender;
    this.lastMessageTime = new Date(data.lastMessageTime);
    this.senderId = data.senderId;
    this.recipientId = data.recipientId;
    this.isSeen = data.isSeen;
  }
}