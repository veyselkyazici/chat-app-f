import { UserProfileResponseDTO } from '../../user/response/UserProfileResponseDTO.js'
import { ContactsDTO } from './ContactsDTO.js'
import { InvitationResponseDTO } from './InvitationResponseDTO.js'

export class FeignClientUserProfileResponseDTO {
    constructor(data) {
        this.contactsDTO = data.contactsDTO ? new ContactsDTO(data.contactsDTO) : null;
        this.userProfileResponseDTO = new UserProfileResponseDTO(data.userProfileResponseDTO);
        this.invitationResponseDTO = data.invitationResponseDTO ? new InvitationResponseDTO(data.invitationResponseDTO) : null;
    }
}