import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/Authroute.js";
import recipeRoutes from "./routes/Recipe.js";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://recipe-platform-rose.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});