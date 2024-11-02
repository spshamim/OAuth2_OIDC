import axios from "axios";
import { logout } from "./auth";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        const res = await instance.post("/auth/refresh");
        localStorage.setItem("accessToken", res.data.token);
        return instance(originalRequest); // Retry the original request with new access token
      } catch (refreshError) {
        if (refreshError.response && refreshError.response.status === 401) {
          logout();  // Call the logout function if refresh token is also invalid
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
