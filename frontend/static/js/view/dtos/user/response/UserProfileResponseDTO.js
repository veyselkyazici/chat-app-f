import { PrivacySettingsResponseDTO } from './PrivacySettingsResponseDTO.js'
import { UserKeyResponseDTO } from './UserKeyResponseDTO.js'
export class UserProfileResponseDTO {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.imagee = data.imagee;
    this.about = data.about;
    this.privacySettings = new PrivacySettingsResponseDTO(data.privacySettings);
    this.userKey = new UserKeyResponseDTO(data.userKey);
  }
}