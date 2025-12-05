import { i18n } from "../i18n/i18n";
import { handleErrorCode } from "../utils/util";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response.status;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshTokenSession = sessionStorage.getItem("refresh_token");
        const response = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {
            refreshToken: refreshTokenSession,
          },
          {
            validateStatus: (status) => status < 500,
          }
        );

        const { accessToken, refreshToken } = response.data.data;
        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("refresh_token", refreshToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    switch (status) {
      case 400:
        handleErrorCode(400, null, i18n);
        break;
      case 403:
        handleErrorCode(403, null, i18n);
        break;
      case 404:
        handleErrorCode(404, null, i18n);
        break;
      case 500:
        handleErrorCode(500, null, i18n);
        break;
      case 503:
        handleErrorCode(503, null, i18n);
        break;
      default:
        handleErrorCode(9999, null, i18n);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
