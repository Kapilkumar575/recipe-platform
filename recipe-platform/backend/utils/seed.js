// backend/scripts/seed.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import slugify from "slugify";

import User from "../models/usermodel.js";
import Recipe from "../models/Recipemodel.js";
import connectDB from "../config/db.js";

/* ================= USERS ================= */
const users = [
  {
    name: "Maria Rossi",
    username: "mariacooks",
    email: "maria@example.com",
    password: "password1",
    bio: "Italian home cook sharing generations of family recipes.",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "James Chen",
    username: "jamesinthekitchen",
    email: "james@example.com",
    password: "password1",
    bio: "Asian fusion enthusiast and weekend chef.",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Priya Sharma",
    username: "priyaeats",
    email: "priya@example.com",
    password: "password1",
    bio: "Vegetarian recipe developer with a passion for Indian spices.",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
];

/* ================= RECIPES ================= */
const sampleRecipes = [
  {
    title: "Classic Spaghetti Carbonara",
    description: "A traditional Roman pasta dish made with eggs, Pecorino Romano, guanciale, and black pepper.",
    category: "dinner",
    cuisine: "italian",
    difficulty: "medium",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
    tags: ["pasta", "italian"],
    dietary: [],
    ingredients: [
      { name: "Spaghetti", amount: "400", unit: "g" },
      { name: "Eggs", amount: "4", unit: "" },
    ],
    instructions: [
      { step: 1, text: "Boil pasta." },
      { step: 2, text: "Mix eggs and cheese." },
    ],
  },
  {
    title: "Butter Chicken",
    description: "Creamy Indian curry loved worldwide.",
    category: "dinner",
    cuisine: "indian",
    difficulty: "medium",
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    tags: ["curry", "indian"],
    dietary: ["gluten-free"],
    ingredients: [
      { name: "Chicken", amount: "500", unit: "g" },
    ],
    instructions: [
      { step: 1, text: "Cook chicken." },
      { step: 2, text: "Add sauce." },
    ],
  },
];

/* ================= SEED FUNCTION ================= */
async function seed() {
  try {
    await connectDB();
    console.log("🌱 Seeding database...\n");

    // Clear DB
    await User.deleteMany();
    await Recipe.deleteMany();
    console.log("✅ Old data cleared");

    // Hash passwords
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Create users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log("✅ Users created");

    // Create recipes
    for (let i = 0; i < sampleRecipes.length; i++) {
      const user = createdUsers[i % createdUsers.length];

      const recipe = new Recipe({
        ...sampleRecipes[i],
        author: user._id,
        slug: slugify(sampleRecipes[i].title, { lower: true }),
      });

      await recipe.save();
    }

    console.log("✅ Recipes created");
    console.log("\n🎉 SEED SUCCESSFUL!\n");

    console.log("Login credentials:");
    users.forEach((u) => {
      console.log(`${u.email} / password1`);
    });

  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}

seed();