import express from "express";
const router = express.Router();

import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addReview,
  toggleSave,
  getFeatured,
  getSimilar,
  getPopularTags,
  getMyRecipes,
} from "../controllers/Recipecontroller.js";

import { protect, optionalAuth } from "../middleware/Authmiddleware.js";
import {
  recipeValidator,
  reviewValidator,
  searchValidator,
  validate,
} from "../middleware/Validators.js";

// Public routes
router.get("/", searchValidator, validate, optionalAuth, getRecipes);
router.get("/featured", getFeatured);
router.get("/tags", getPopularTags);
router.get("/my", protect, getMyRecipes);
router.get("/:id/similar", getSimilar);
router.get("/:slug", optionalAuth, getRecipe);

// Protected routes
router.post("/", protect, recipeValidator, validate, createRecipe);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);
router.post("/:id/reviews", protect, reviewValidator, validate, addReview);
router.post("/:id/save", protect, toggleSave);

export default router;