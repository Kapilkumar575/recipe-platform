import Recipe from "../models/Recipemodel.js";
import User from "../models/usermodel.js";

/* ================= HELPERS ================= */

// Normalize instructions (auto-add step)
const normalizeInstructions = (instructions) => {
  return instructions.map((inst, i) => ({
    ...inst,
    step: i + 1,
  }));
};

/* ================= CONTROLLERS ================= */

// GET ALL RECIPES
export const getRecipes = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name username avatar")
        .select("-instructions -reviews"),
      Recipe.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: recipes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE RECIPE
export const getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate("author", "name username avatar");

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    await Recipe.findByIdAndUpdate(recipe._id, { $inc: { viewCount: 1 } });

    let isSaved = false;
    if (req.user) {
      isSaved = recipe.savedBy.some(
        (id) => id.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      data: { ...recipe.toObject(), isSaved },
    });
  } catch (error) {
    next(error);
  }
};

// CREATE RECIPE
export const createRecipe = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const recipe = await Recipe.create({
      ...req.body,
      image,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE RECIPE
export const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    if (
      recipe.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (req.body.instructions) {
      req.body.instructions = normalizeInstructions(req.body.instructions);
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE RECIPE
export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    if (
      recipe.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await recipe.deleteOne();

    await User.updateMany(
      { savedRecipes: recipe._id },
      { $pull: { savedRecipes: recipe._id } }
    );

    res.json({ success: true, message: "Recipe deleted" });
  } catch (error) {
    next(error);
  }
};

// ADD REVIEW
export const addReview = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const alreadyReviewed = recipe.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Already reviewed",
      });
    }

    recipe.reviews.push({
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    recipe.recalculateRating();
    await recipe.save();

    res.json({ success: true, message: "Review added" });
  } catch (error) {
    next(error);
  }
};

// SAVE / UNSAVE
export const toggleSave = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const userId = req.user._id;

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const isSaved = recipe.savedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (isSaved) {
      recipe.savedBy.pull(userId);
      await User.findByIdAndUpdate(userId, {
        $pull: { savedRecipes: recipe._id },
      });
    } else {
      recipe.savedBy.push(userId);
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedRecipes: recipe._id },
      });
    }

    await recipe.save();

    res.json({
      success: true,
      message: isSaved ? "Unsaved" : "Saved",
    });
  } catch (error) {
    next(error);
  }
};

// FEATURED RECIPES
export const getFeatured = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ isFeatured: true })
      .limit(6)
      .populate("author", "name username");

    res.json({ success: true, data: recipes });
  } catch (error) {
    next(error);
  }
};

// SIMILAR RECIPES
export const getSimilar = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    const similar = await Recipe.find({
      _id: { $ne: recipe._id },
      category: recipe.category,
    }).limit(4);

    res.json({ success: true, data: similar });
  } catch (error) {
    next(error);
  }
};

// POPULAR TAGS
export const getPopularTags = async (req, res, next) => {
  try {
    const tags = await Recipe.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({ success: true, data: tags });
  } catch (error) {
    next(error);
  }
};

// MY RECIPES
export const getMyRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id });

    res.json({ success: true, data: recipes });
  } catch (error) {
    next(error);
  }
};