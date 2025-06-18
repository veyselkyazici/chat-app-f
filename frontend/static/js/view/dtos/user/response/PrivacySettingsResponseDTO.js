export class PrivacySettingsResponseDTO {
  constructor(data) {
    this.id = data.id; // UUID
    this.profilePhotoVisibility = data.profilePhotoVisibility; // string, örn: "EVERYONE", "CONTACTS", "NOBODY"
    this.lastSeenVisibility = data.lastSeenVisibility;
    this.onlineStatusVisibility = data.onlineStatusVisibility;
    this.aboutVisibility = data.aboutVisibility;
    this.readReceipts = data.readReceipts; // boolean
    this.isInContactList = data.isInContactList; // boolean
  }
}