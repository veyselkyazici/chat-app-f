import { MessageDTO } from "./MessageDTO";
export class ChatDTO {
  constructor(data) {
    this.id = data.id;
    this.participantIds = data.participantIds || [];
    this.messages = (data.messages || []).map(msg => new MessageDTO(msg));
    this.isLastPage = data.isLastPage ?? false;
  }
}