export class PrivacySettingsResponseDTO {
  constructor(data) {
    this.id = data.id; 
    this.profilePhotoVisibility = data.profilePhotoVisibility; 
    this.lastSeenVisibility = data.lastSeenVisibility;
    this.onlineStatusVisibility = data.onlineStatusVisibility;
    this.aboutVisibility = data.aboutVisibility;
    this.readReceipts = data.readReceipts;
    this.isInContactList = data.isInContactList;
  }
}