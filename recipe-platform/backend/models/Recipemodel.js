import mongoose from "mongoose";
import slugify from "slugify";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    unit: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const instructionSchema = new mongoose.Schema(
  {
    step: { type: Number, required: true },
    text: { type: String, required: true, trim: true },
    image: { type: String, default: null },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const nutritionSchema = new mongoose.Schema(
  {
    calories: Number,
    protein: String,
    carbohydrates: String,
    fat: String,
    fiber: String,
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, default: null },

    category: {
      type: String,
      required: true,
      enum: ["breakfast","lunch","dinner","dessert","snack","appetizer","soup","salad","beverage","side-dish","other"],
    },

    cuisine: {
      type: String,
      required: true,
      enum: ["italian","mexican","chinese","japanese","indian","french","mediterranean","american","thai","greek","spanish","middle-eastern","korean","vietnamese","other"],
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard", "expert"],
    },

    prepTime: { type: Number, required: true, min: 0 },
    cookTime: { type: Number, required: true, min: 0 },
    servings: { type: Number, required: true, min: 1 },

    ingredients: {
      type: [ingredientSchema],
      validate: [(arr) => arr.length >= 1, "At least one ingredient is required"],
    },

    instructions: {
      type: [instructionSchema],
      validate: [(arr) => arr.length >= 1, "At least one instruction is required"],
    },

    tags: [{ type: String, trim: true, lowercase: true }],
    nutrition: nutritionSchema,
    reviews: [reviewSchema],

    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewCount: { type: Number, default: 0 },

    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    dietary: [
      {
        type: String,
        enum: ["vegetarian","vegan","gluten-free","dairy-free","keto","paleo","nut-free","low-carb"],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
recipeSchema.virtual("totalTime").get(function () {
  return this.prepTime + this.cookTime;
});

recipeSchema.virtual("savedCount").get(function () {
  return this.savedBy?.length || 0;
});

// Indexes
recipeSchema.index({ title: "text", description: "text", tags: "text" });
recipeSchema.index({ category: 1, cuisine: 1, difficulty: 1 });
recipeSchema.index({ averageRating: -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ author: 1 });
recipeSchema.index({ slug: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ dietary: 1 });

// Slug generator
recipeSchema.pre("save", async function () {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (
      await mongoose.models.Recipe.findOne({
        slug,
        _id: { $ne: this._id },
      })
    ) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  
});

// Rating calculation
recipeSchema.methods.recalculateRating = function () {
  if (!this.reviews.length) {
    this.averageRating = 0;
    this.reviewCount = 0;
  } else {
    const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
    this.reviewCount = this.reviews.length;
  }
};

export default mongoose.model("Recipe", recipeSchema);