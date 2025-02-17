import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import store from "../reduxStore/store";
import { useDispatch } from "react-redux";
import { LoggedOut } from "../reduxStore/slices/userSlice";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.appUser?.user?.token;
    console.log("token",token)
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
    // const dispatch = useDispatch(); 
console.log(error)
    if (error.response) {
      const responseData = error.response.data as { message: string };

      if (error.response.status === 401 && responseData.message.toLowerCase().includes('Token is not valid')) {
        console.error('Invalid token, logging out...');

        store.dispatch(LoggedOut());

      }
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

  getUserImages: (userId:string) => api.get(`/images/user/${userId}`),

  reorderImages: (imageArray:any,userId:string) =>
    api.put("/images/reorder", { imageArray,userId }),

  editImage: (
    imageId: string,
    updateData: { title?: string; userId?: string }
  ) => api.put(`/images/${imageId}`, updateData),

  deleteImage: (imageId: string,userId:string) => api.delete(`/images/${imageId}/user/${userId}`),
};
