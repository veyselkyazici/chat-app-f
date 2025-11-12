import axiosInstance from "./axiosConfig.js";
const CONTACTS_SERVICE_URL = import.meta.env.VITE_CONTACTS_SERVICE_URL;
const INVITATION_SERVICE_URL = import.meta.env.VITE_INVITATION_SERVICE_URL;

export const contactService = {
  async deleteContactOrInvitation(id, type) {
    try {
      const url =
        type === "contact"
          ? `${CONTACTS_SERVICE_URL}/${id}`
          : `${INVITATION_SERVICE_URL}/${id}`;

      const response = await axiosInstance.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting contact/invitation:", error);
      throw error;
    }
  },

  async sendInvitation(sendInvitationDTO) {
    try {
      const response = await axiosInstance.post(
        `${INVITATION_SERVICE_URL}/send-invitation`,
        sendInvitationDTO
      );
      return response;
    } catch (error) {
      console.error("Error sending invitation:", error);
      throw error;
    }
  },

  async getContactList(userId) {
    try {
      const response = await axiosInstance.get(
        `${CONTACTS_SERVICE_URL}/get-contact-list`,
        { params: { userId } }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching contact list:", error);
      throw error;
    }
  },

  async addContact(dto) {
    try {
      const response = await axiosInstance.post(
        `${CONTACTS_SERVICE_URL}/add-contact`,
        dto
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
