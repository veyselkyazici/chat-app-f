import axiosInstance from "./axiosConfig.js";
const CONTACTS_SERVICE_URL = "/contacts";
const INVITATION_SERVICE_URL = "/invitation";

export const contactService = {
  async deleteContactOrInvitation(id, type) {
    try {
      const url =
        type === "contact"
          ? `${CONTACTS_SERVICE_URL}/${id}`
          : `${INVITATION_SERVICE_URL}/${id}`;

      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error("Error deleting contact/invitation:", error);
      throw error;
    }
  },

  async sendInvitation(data) {
    const requestBody = {
      invitationId: data.invitationId,
      inviteeEmail: data.email,
      contactName: data.userContactName,
      inviterUserId: data.inviterUserId,
      isInvited: data.invited,
      inviterEmail: null,
    };

    try {
      await axiosInstance.post(
        `${INVITATION_SERVICE_URL}/send-invitation`,
        requestBody
      );
      return true;
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

      toastr.success("User added successfully!");
      return response;
    } catch (error) {
      toastr.error(
        error.response?.data?.message || "An error occurred during the process."
      );
      throw error;
    }
  },
};
