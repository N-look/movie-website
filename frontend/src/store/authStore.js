import { create } from "zustand";
import axios from "axios";

const API_URL = "https://aiflix-6ual.onrender.com/api";

// Create a dedicated Axios instance with timeout
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 8000, // 8 second timeout
});

export const useAuthStore = create((set) => ({
  // initial states
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,
  authMessage: null,

  // functions

  signup: async (username, email, password) => {
    set({ isLoading: true, message: null, authMessage: "Signing up..." });

    try {
      const response = await api.post(`/signup`, {
        username,
        email,
        password,
      });

      set({ user: response.data.user, isLoading: false, authMessage: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || "Error Signing up",
        authMessage: null,
      });

      throw error;
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, message: null, error: null, authMessage: "Logging in..." });

    try {
      const response = await api.post(`/login`, {
        username,
        password,
      });

      const { user, message } = response.data;

      set({
        user,
        message,
        isLoading: false,
        authMessage: null,
      });

      return { user, message };
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || "Error logging in",
        authMessage: null,
      });

      throw error;
    }
  },

  fetchUser: async () => {
    set({ fetchingUser: true, error: null, authMessage: "Fetching user..." });

    try {
      const response = await api.get(`/fetch-user`);
      set({ user: response.data.user, fetchingUser: false, authMessage: null });
    } catch (error) {
      set({
        fetchingUser: false,
        error: null,
        user: null,
        authMessage: null,
      });
      // Don't throw to prevent unhandled promise rejections
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null, authMessage: "Logging out..." });

    try {
      const response = await api.post(`/logout`);
      const { message } = response.data;
      set({
        message,
        isLoading: false,
        user: null,
        error: null,
      });

      return { message };
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || "Error logging out",
      });

      throw error;
    }
  },

}));