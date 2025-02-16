import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import store from "../reduxStore/store";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.appUser?.user?.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error("Response error:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

export const userApi = {
  register: (userData: any) => api.post("/user/register", userData),
  login: (credentials: any) => api.post("/user/login", credentials),
  forgotPassword: (email: string) =>
    api.post("/user/forgot-password", { email }),
  validateOTP: (otp: string, email: string) =>
    api.post("/user/validate-otp", { email, otp }),
  resetPassword: (resetData: any) =>
    api.post("/user/reset-password", resetData),
  verifyEmail: (token: string) => {
    console.log(token);
    api.post("/user/verifyEmail", { token });
  },
  getUser: (id: string) => api.get(`/user/${id}`),
};

export const imageApi = {
  addImages: (formData: FormData) =>
    api.post("/images/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getUserImages: () => api.get("/images/user"),

  reorderImages: (newOrder: { imageId: string; newPosition: number }[]) =>
    api.put("/images/reorder", { newOrder }),

  editImage: (
    imageId: string,
    updateData: { title?: string; description?: string }
  ) => api.put(`/images/${imageId}`, updateData),

  deleteImage: (imageId: string) => api.delete(`/images/${imageId}`),
};
