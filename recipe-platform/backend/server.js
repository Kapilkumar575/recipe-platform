import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// 🔥 IMPORTANT: register models
import "./models/usermodel.js";
import "./models/Recipemodel.js";

// Routes
import authRoutes from "./routes/Authroute.js";
import recipeRoutes from "./routes/Recipe.js";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/upload.js";
dotenv.config();
connectDB();

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: [
    "http://localhost:5173", // local frontend
    "https://your-frontend.vercel.app" // later when deployed
  ],
  credentials: true,
}));
app.use(express.json());

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/uploads', express.static('uploads'));
/* ===== TEST ===== */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});