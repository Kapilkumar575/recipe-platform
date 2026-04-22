import User from "../models/usermodel.js";
import Recipe from "../models/Recipemodel.js";

// GET PUBLIC PROFILE
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password -savedRecipes -email");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const recipes = await Recipe.find({
      author: user._id,
      isPublished: true
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .select("-instructions -reviews");

    const isFollowing = req.user
      ? user.followers.some(
          (id) => id.toString() === req.user._id.toString()
        )
      : false;

    res.json({
      success: true,
      data: {
        user: user.toPublicJSON(),
        recipes,
        isFollowing
      }
    });
  } catch (error) {
    next(error);
  }
};

// FOLLOW / UNFOLLOW
export const toggleFollow = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself"
      });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isFollowing = targetUser.followers.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (isFollowing) {
      targetUser.followers.pull(req.user._id);
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: targetUser._id }
      });
    } else {
      targetUser.followers.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { following: targetUser._id }
      });
    }

    await targetUser.save();

    res.json({
      success: true,
      message: isFollowing ? "Unfollowed" : "Following",
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length
    });
  } catch (error) {
    next(error);
  }
};

// GET SAVED RECIPES
export const getSavedRecipes = async (req, res, next) => {
  try {
    // 🔥 FIX: always use req.user.id (safer)
    const user = await User.findById(req.user.id).populate({
      path: "savedRecipes",
      populate: {
        path: "author",
        select: "name username avatar"
      },
      options: { sort: { createdAt: -1 } },
      select: "-instructions -reviews"
    });

    // ✅ Extra safety check
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user.savedRecipes
    });

  } catch (error) {
    next(error);
  }
};
// GET ALL USERS (ADMIN)
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password"),
      User.countDocuments()
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};