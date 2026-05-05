import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// Register models
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

/* ===== CORS CONFIG (FINAL FIX) ===== */
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://recipe-platform-rose.vercel.app" // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

/* ===== MIDDLEWARE ===== */
app.use(express.json());

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

/* ===== STATIC FILES ===== */
app.use("/uploads", express.static("uploads"));

/* ===== TEST ROUTE ===== */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});