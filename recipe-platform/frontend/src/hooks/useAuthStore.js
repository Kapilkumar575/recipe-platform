import { create } from "zustand";

import {authAPI} from "../services/api";

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  /* ================= SET USER ================= */
  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },

  /* ================= LOGIN ================= */
  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await authAPI.login(credentials);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isLoading: false,
      });

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed";

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message);
    }
  },

  /* ================= REGISTER ================= */
  register: async (userData) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await authAPI.register(userData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isLoading: false,
      });

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed";

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message);
    }
  },

  /* ================= LOGOUT ================= */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
      error: null,
    });

    // redirect after logout
    window.location.href = "/login";
  },

  /* ================= REFRESH USER ================= */
  refreshUser: async () => {
    try {
      const { data } = await authAPI.getMe();

      set({ user: data.user });
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      get().logout(); // auto logout if token invalid
    }
  },

  /* ================= CLEAR ERROR ================= */
  clearError: () => set({ error: null }),

  /* ================= AUTH CHECK ================= */
  isAuthenticated: () => {
    const { token, user } = get();
    return !!token && !!user;
  },
}));

export default useAuthStore;