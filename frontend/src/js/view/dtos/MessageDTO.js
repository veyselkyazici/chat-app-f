export class MessageDTO {
    constructor({ chatRoomId = '', messageContent = '', fullDateTime = '', senderId = '', recipientId = '' } = {}) {
        this.chatRoomId = chatRoomId;
        this.messageContent = messageContent;
        this.fullDateTime = fullDateTime;
        this.senderId = senderId;
        this.recipientId = recipientId;
    }
}