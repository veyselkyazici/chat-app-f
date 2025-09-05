import axiosInstance from "./axiosConfig.js";

const AUTH_SERVICE_URL = "/auth";

export const authService = {
  isAuthenticated: async () => {
    try {
      await axiosInstance.get(`${AUTH_SERVICE_URL}/authenticate`);
      return true;
    } catch (error) {
      console.error("Authentication check failed:", error);
      return false;
    }
  },

  register: async (registerRequestDTO) => {
    try {
      const response = await axiosInstance.post(
        `${AUTH_SERVICE_URL}/register`,
        registerRequestDTO
      );
      return response.data;
    } catch (error) {
      let message = "Registration failed";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else {
        message = error.message || "Unexpected network error";
      }

      return {
        success: false,
        message,
        errors: error.response?.data?.errors || [],
        status: error.response?.status || 0,
      };
    }
  },

  logout: () => {
    try {
      const response = axiosInstance.post(`${AUTH_SERVICE_URL}/logout`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  login: async (loginRequestDTO) => {
    try {
      const response = await axiosInstance.post(
        `${AUTH_SERVICE_URL}/login`,
        loginRequestDTO
      );
      if (response.data.data.accessToken && response.data.data.refreshToken) {
        sessionStorage.setItem("access_token", response.data.data.accessToken);
        sessionStorage.setItem("refresh_token", response.data.data.refreshToken);
        sessionStorage.setItem("id", response.data.data.id);
      }

      return response.data;
    } catch (error) {
      let message = "Login failed";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else {
        message = error.message || "Unexpected network error";
      }

      return {
        success: false,
        message,
        errors: error.response?.data?.errors || [],
        status: error.response?.status || 0,
      };
    }
  },

  createForgotPassword: async (createForgotPasswordRequestDTO) => {
    try {
      const response = await axiosInstance.post(
        `${AUTH_SERVICE_URL}/create-forgot-password`,
        createForgotPasswordRequestDTO
      );
      return response.data;
    } catch (error) {
      let message = "Reset password failed";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else {
        message = error.message || "Unexpected network error";
      }

      return {
        success: false,
        message,
        errors: error.response?.data?.errors || [],
        status: error.response?.status || 0,
      };
    }
  },

  checkOTP: async (email, otp, recaptchaToken) => {
    try {
      const response = await axiosInstance.post(
        `${AUTH_SERVICE_URL}/check-otp`,
        { email, otp, recaptchaToken }
      );
      return response.data;
    } catch (error) {
      let message = "Reset password failed";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else {
        message = error.message || "Unexpected network error";
      }

      return {
        success: false,
        message,
        errors: error.response?.data?.errors || [],
        status: error.response?.status || 0,
      };
    }
  },

  resetPassword: async (resetPasswordDTO) => {
    try {
      const response = await axiosInstance.post(
        `${AUTH_SERVICE_URL}/reset-password`,
        resetPasswordDTO
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  },
};
