import express from "express";

import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} from "../controllers/Authcontroller.js";

import { protect } from "../middleware/Authmiddleware.js";

import {
  registerValidator,
  loginValidator,
  validate
} from "../middleware/Validators.js";

const router = express.Router();

// Auth routes
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;