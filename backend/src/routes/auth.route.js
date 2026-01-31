import express from "express";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("Signup point");
});

router.get("/login", (req, res) => {
  res.send("login point");
});

router.get("/logout", (req, res) => {
  res.send("logout point");
});

export default router;
