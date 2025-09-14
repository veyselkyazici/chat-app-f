
export class SendInvitationDTO {
  constructor(data, inviterEmail) {
    this.invitationId = data.id;
    this.inviteeEmail = data.inviteeEmail;
    this.contactName = data.contactName;
    this.inviterUserId = data.inviterUserId;
    this.isInvited = data.isInvited;
    this.inviterEmail = inviterEmail;
  }
}
