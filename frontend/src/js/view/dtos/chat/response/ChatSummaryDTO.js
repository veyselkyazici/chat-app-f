
import { ChatDTO } from './ChatDTO.js'
import { UserChatSettingsDTO } from './UserChatSettingsDTO.js'
import { ContactsDTO } from '../../contact/response/ContactsDTO.js'
import { UserProfileResponseDTO } from '../../user/response/UserProfileResponseDTO.js'
export class ChatSummaryDTO {
    constructor(data) {
        this.chatDTO = new ChatDTO(data.chatDTO);
        this.contactsDTO = new ContactsDTO(data.contactsDTO);
        this.userProfileResponseDTO = new UserProfileResponseDTO(data.userProfileResponseDTO);
        this.userChatSettingsDTO = new UserChatSettingsDTO(data.userChatSettingsDTO);
    }
}