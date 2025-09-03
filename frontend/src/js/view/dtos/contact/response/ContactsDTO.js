export class ContactsDTO {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.userContactId = data.userContactId;
    this.userContactName = data.userContactName;
    this.userHasAddedRelatedUser = data.userHasAddedRelatedUser;
    this.relatedUserHasAddedUser = data.relatedUserHasAddedUser;
  }
}
