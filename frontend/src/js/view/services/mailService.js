import axiosInstance from "./axiosConfig.js";

const MAIL_SERVICE_URL = "/mail";

export const mailService = {
  resendConfirmationMail: async (resendConfirmationDTO) => {
    debugger;
    try {
      const response = await axiosInstance.post(
        `${MAIL_SERVICE_URL}/resend-confirmation`,
        resendConfirmationDTO
      );
      return response;
    } catch (error) {
      console.error("Authentication check failed:", error);
      throw error;
    }
  },
  saveVerifiedAccountId: async (token) => {
    try {
      const response = await axiosInstance.get(`${MAIL_SERVICE_URL}`, {
        params: { token },
      });
      return response;
    } catch (error) {
      console.error("Verify failed:", error);
      throw error;
    }
  },
};
