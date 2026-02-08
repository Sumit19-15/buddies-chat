import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

// now function of the auth store

export const useAuthStore = create((set) => ({
  authUser: null, // login user data store here
  isCheckingAuth: true, // checking that authenticaiton checking is on or not
  isSigningUp: false,
  isLoggingIn: false,

  // checking auth function every time reload page
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check"); // backend requested here for authentication
      set({ authUser: res.data });
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
    } catch (error) {
      toast.error("Error while logout!");
      console.log("Failed in logout :", error);
    }
  },
}));
