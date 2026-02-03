import axiosInstance from "./axiosConfig.js";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const BASE_URL_MAIN_USER = import.meta.env.BASE_URL_USER;

export const userService = {
  updatePrivacy: async (privacyDTO) => {
    try {
      const response = await axiosInstance.put(
        `${USER_SERVICE_URL}/privacy-settings`,
        privacyDTO
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  updateUserName: async (updateUserDTO) => {
    try {
      const response = await axiosInstance.put(
        `${USER_SERVICE_URL}/update-user-name`,
        updateUserDTO
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  updateUserSurname: async (updateUserDTO) => {
    try {
      const response = await axiosInstance.put(
        `${USER_SERVICE_URL}/update-user-surname`,
        updateUserDTO
      );
      toastr.success("Soyadınız değiştirildi");
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  updateUserPhone: async (updateUserDTO) => {
    try {
      const response = await axiosInstance.put(
        `${USER_SERVICE_URL}/update-user-phone`,
        updateUserDTO
      );
      toastr.success("Telefon numaranız değiştirildi");
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  updateUserAbout: async (updateUserDTO) => {
    try {
      const response = await axiosInstance.put(
        `${USER_SERVICE_URL}/update-user-about`,
        updateUserDTO
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  updateUserProfile: async (data) => {
    try {
      const response = await axiosInstance.put(
        `${USER_SERVICE_URL}/update-profile`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  getUserWithUserKeyByAuthId: async () => {
    try {
      const response = await axiosInstance.post(
        `${USER_SERVICE_URL}/get-user-with-user-key-by-auth-id`
      );

      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  uploadPhoto: async (formData) => {
    try {
      const response = await axiosInstance.post(
        `${USER_SERVICE_URL}/upload-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  removePhoto: async () => {
    try {
      const response = await axiosInstance.patch(
        `${USER_SERVICE_URL}/remove-profile-picture`
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  updateUserLastSeen: async () => {
    try {
      const response = await axiosInstance.put(
        `${USER_SERVICE_URL}/update-user-last-seen`
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  updateLastSeenOnExit: async () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return;
    try {
      fetch(`${BASE_URL_MAIN_USER}/update-user-last-seen`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        keepalive: true,
      }).catch(() => {
        console.warn("Keepalive request failed");
      });
      return;
    } catch (error) {
      console.warn("Fetch with keepalive failed:", error);
    }
  },
};
