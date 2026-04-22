import express from "express";
const router = express.Router();

import { uploadImage, deleteImage } from "../controllers/Uploadcontroller.js";
import { protect } from "../middleware/Authmiddleware.js";
import upload from "../middleware/upload.js";

// Upload image
router.post("/", protect, upload.single("image"), uploadImage);

// Delete image
router.delete("/:filename", protect, deleteImage);

export default router;