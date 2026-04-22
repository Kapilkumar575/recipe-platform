import express from "express";
const router = express.Router();

import {
  getProfile,
  toggleFollow,
  getSavedRecipes,
  getUsers
} from "../controllers/Usercontroller.js";

import {
  protect,
  optionalAuth,
  authorize
} from "../middleware/Authmiddleware.js";

// Routes
router.get("/", protect, authorize("admin"), getUsers);
router.get("/saved", protect, getSavedRecipes);
router.post("/:id/follow", protect, toggleFollow);
router.get("/:username", optionalAuth, getProfile);

export default router;