export class InvitationResponseDTO {
  constructor(data) {
    this.id = data.id;
    this.isInvited = data.invited;
    this.contactName = data.contactName;
    this.inviterUserId = data.inviterUserId;
    this.inviteeEmail = data.inviteeEmail;
  }
}
