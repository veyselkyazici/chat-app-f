import axiosInstance from "./axiosConfig.js";
const CHAT_SERVICE_URL = "/chat";
export const chatService = {
  deleteChat: async (userChatSettings) => {
    try {
      const response = await axiosInstance.put(
        `${CHAT_SERVICE_URL}/delete-chat`,
        userChatSettings
      );
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  getLast30Messages: async (chatRoomId) => {
    try {
      const response = await axiosInstance.get(
        `${CHAT_SERVICE_URL}/messages/last-30-messages`,
        {
          params: { chatRoomId, limit: 30 },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  getChatSummary: async (userContactId, chatRoomId) => {
    try {
      const response = await axiosInstance.get(
        `${CHAT_SERVICE_URL}/chat-summary`,
        {
          params: { userContactId, chatRoomId },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  chatBlock: async (chatSummaryDTO) => {
    try {
      const response = await axiosInstance.put(
        `${CHAT_SERVICE_URL}/chat-block`,
        chatSummaryDTO
      );
      return response.data.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  chatPinned: async (chatSummaryDTO) => {
    try {
      const response = await axiosInstance.put(
        `${CHAT_SERVICE_URL}/chat-pinned`,
        chatSummaryDTO
      );
      toastr.success(response.data.message);
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  chatUnPinned: async (chatSummaryDTO) => {
    try {
      const response = await axiosInstance.put(
        `${CHAT_SERVICE_URL}/chat-unpinned`,
        chatSummaryDTO
      );
      toastr.success(response.data.message);
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  chatUnblock: async (chatSummaryDTO) => {
    try {
      const response = await axiosInstance.put(
        `${CHAT_SERVICE_URL}/chat-unblock`,
        chatSummaryDTO
      );
      return response.data.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  getChatSummaries: async () => {
    try {
      const response = await axiosInstance.get(
        `${CHAT_SERVICE_URL}/chat-summaries`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  createChatRoomIfNotExists: async (friendId) => {
    try {
      const response = await axiosInstance.post(
        `${CHAT_SERVICE_URL}/create-chat-room-if-not-exists`,
        { friendId }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  getOlder30Messages: async (chatRoomId, before) => {
    try {
      const response = await axiosInstance.get(
        `${CHAT_SERVICE_URL}/messages/older-30-messages`,
        {
          params: { chatRoomId, before, limit: 30 },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  checkUserOnlineStatus: async (contactId) => {
    try {
      const response = await axiosInstance.get(
        `/status/is-online/${contactId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      return false;
    }
  },
};
