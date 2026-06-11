import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import "dotenv/config";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

// register new user and generate token
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // checking password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check if email valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist " });
    }

    // save user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // authentication of new user
    if (newUser) {
      // first save then  token
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      // sending welcome email to new user
      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL,
        );
      } catch (error) {
        console.log("Failed to send Welcome email", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error in SignUp" });
  }
};

// login user and generate token
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password is requried" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    console.log("User login with id :", user._id);
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error in login" });
  }
};

// logout user by clearing the cookie
export const logout = async (_, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    message: "Logout successfully",
  });
};

// update user profile picture
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id; // due to middleware line req.user = user

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }, // this line will help to return the new updated user
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
