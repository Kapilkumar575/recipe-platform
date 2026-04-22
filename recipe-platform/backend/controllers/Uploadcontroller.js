import path from "path";
import fs from "fs";

// UPLOAD IMAGE
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    next(error);
  }
};

// DELETE IMAGE
export const deleteImage = async (req, res, next) => {
  try {
    const filename = req.params.filename;

    // Validate filename (security)
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename"
      });
    }

    const uploadPath = process.env.UPLOAD_PATH || "./uploads";
    const filePath = path.join(uploadPath, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    // ✅ Use async delete (better than unlinkSync)
    await fs.promises.unlink(filePath);

    res.json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};