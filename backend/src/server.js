// main server file
// const express = require("express"); in pack-json add type modules to use import
import express from "express";
const app = express();

app.get("api/auth/signup", (req, res) => {
  res.send("Signup endpoint");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

app.get("/", (req, res) => {
  res.json("time is their");
});
