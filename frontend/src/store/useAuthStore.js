import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

// now function of the auth store

export const useAuthStore = create((set, get) => ({
  authUser: null, // login user data store here
  isCheckingAuth: true, // checking that authenticaiton checking is on or not
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // checking auth function every time reload page
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check"); // backend requested here for authentication
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck in Authstore", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // handel signin
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data); // req at backend
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message); // axios error messages handel in this way
    } finally {
      set({ isSigningUp: false });
    }
  },

  // handel login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data); // req at backend
      set({ authUser: res.data });
      toast.success("Login Successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message); // axios error messages handel in this way
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // handel logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout Successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error while logout!");
      console.log("Failed in logout :", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

  // connection socket
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
