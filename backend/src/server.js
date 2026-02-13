// main server file
// const express = require("express"); in pack-json add type modules to use import
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const __dirname = path.resolve(); // for production variable declare

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" })); //for req.body and limit for frontend req
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })); // for frontend requested
app.use(cookieParser());

// declaring that go on Routes for this route
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Listening on the Port ${PORT}`);
  connectDB();
});
