import { body, query, validationResult } from "express-validator";

// Handle validation result
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
};

// Auth validators
export const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),

  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
];

// Login validator
export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// Recipe validator
export const recipeValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10, max: 1000 }).withMessage("Description must be 10-1000 characters"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn([
      "breakfast","lunch","dinner","dessert","snack",
      "appetizer","soup","salad","beverage","side-dish","other"
    ]).withMessage("Invalid category"),

  body("cuisine")
    .notEmpty().withMessage("Cuisine is required")
    .isIn([
      "italian","mexican","chinese","japanese","indian",
      "french","mediterranean","american","thai","greek",
      "spanish","middle-eastern","korean","vietnamese","other"
    ]).withMessage("Invalid cuisine"),

  body("difficulty")
    .notEmpty().withMessage("Difficulty is required")
    .isIn(["easy", "medium", "hard", "expert"])
    .withMessage("Invalid difficulty"),

  body("prepTime")
    .notEmpty().withMessage("Prep time is required")
    .isInt({ min: 0 }).withMessage("Prep time must be positive"),

  body("cookTime")
    .notEmpty().withMessage("Cook time is required")
    .isInt({ min: 0 }).withMessage("Cook time must be positive"),

  body("servings")
    .notEmpty().withMessage("Servings is required")
    .isInt({ min: 1 }).withMessage("Servings must be at least 1"),

  body("ingredients")
    .isArray({ min: 1 }).withMessage("At least one ingredient is required"),

  body("ingredients.*.name")
    .trim()
    .notEmpty().withMessage("Ingredient name is required"),

  body("ingredients.*.amount")
    .trim()
    .notEmpty().withMessage("Ingredient amount is required"),

  body("instructions")
    .isArray({ min: 1 }).withMessage("At least one instruction is required"),

  body("instructions.*.text")
    .trim()
    .notEmpty().withMessage("Instruction text is required"),
];

// Review validator
export const reviewValidator = [
  body("rating")
    .notEmpty().withMessage("Rating is required")
    .isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Comment too long"),
];

// Search validator
export const searchValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be positive"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage("Limit must be 1-50"),

  query("minRating")
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage("Invalid rating"),

  query("maxTime")
    .optional()
    .isInt({ min: 1 }).withMessage("Invalid time"),
];