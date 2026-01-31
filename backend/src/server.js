// main server file
// const express = require("express"); in pack-json add type modules to use import
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// declaring that go on Routes for this route
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`Listening on the Port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json("time is their");
});
