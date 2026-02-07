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
  // checking auth function every time reload page
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/check"); // backend requested here
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in authCheck", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response.data.message); // axios error messages handel in this way
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
