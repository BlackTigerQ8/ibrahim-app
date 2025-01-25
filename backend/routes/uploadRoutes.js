const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { User } = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");
const iconv = require("iconv-lite");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const getUploadFileName = (file) => {
  const originalName = iconv.decode(
    Buffer.from(file.originalname, "binary"),
    "utf8"
  );

  return `${Date.now()}-${path.parse(originalName).name}${path.extname(
    originalName
  )}`;
};

///// STORAGES /////
// Image storage configuration
const images = multer.diskStorage({
  destination: "./uploads/profile-images",
  filename(req, file, cb) {
    cb(null, getUploadFileName(file));
  },
});

// Category image storage configuration
const categoryImages = multer.diskStorage({
  destination: "./uploads/category-images",
  filename(req, file, cb) {
    cb(null, getUploadFileName(file));
  },
});

///// COMBINED TRAINING UPLOAD /////
const trainingUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dest =
        file.fieldname === "image"
          ? "./uploads/training-images"
          : "./uploads/training-files";
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      cb(null, getUploadFileName(file));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image") {
      checkImageFileType(file, cb, "training images");
    } else {
      checkPdfFileType(file, cb, "training files");
    }
  },
});

const uploadFields = [
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
];

// Training image storage configuration
const trainingImages = multer.diskStorage({
  destination: "./uploads/training-images",
  filename(req, file, cb) {
    const fileName = getUploadFileName(file);
    cb(null, fileName);
  },
});

// Training files storage configuration
const trainingFiles = multer.diskStorage({
  destination: "./uploads/training-files",
  filename(req, file, cb) {
    cb(null, getUploadFileName(file));
  },
});

///// INSTANCES /////
// Image upload instance
const profileImageUpload = multer({
  storage: images,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb, "images");
  },
});

// Category image upload instance
const categoryImageUpload = multer({
  storage: categoryImages,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb, "category images");
  },
});

// Training image/video upload instance with compression
const trainingImageUpload = multer({
  storage: trainingImages,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb, "training images/videos");
  },
});

// Training file upload instance
const trainingFileUpload = multer({
  storage: trainingFiles,
  fileFilter: function (req, file, cb) {
    checkPdfFileType(file, cb, "training files");
  },
});

///// CHECK FILE TYPES /////
// Check image file type
function checkImageFileType(file, cb, storageType) {
  const filetypes = /pdf|jpeg|jpg|png|mp4|mov|avi/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    /^(image\/(jpeg|jpg|png)|video\/(mp4|quicktime|x-msvideo))$/.test(
      file.mimetype
    );

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb({
      message: `Allowed file types for ${storageType}: pdf, jpeg, jpg, png, mp4, mov, avi`,
    });
  }
}

// Check pdf file type
function checkPdfFileType(file, cb, storageType) {
  console.log("checkPdfFileType", file);

  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb({
      message: `Allowed file types for ${storageType}: pdf, jpeg, jpg, png`,
    });
  }
}

// Function to compress video
const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec("libx264")
      .size("720x?") // Resize to 720p width, maintain aspect ratio
      .videoBitrate("1000k") // Reduce bitrate
      .outputOptions(["-crf 28"]) // Compression quality (23-28 is good range)
      .on("end", () => {
        // Delete original file after compression
        require("fs").unlink(inputPath, (err) => {
          if (err) console.error("Error deleting original video:", err);
        });
        resolve();
      })
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
};

// Create a single upload middleware
const singleUpload = trainingImageUpload.single("image");

// Wrap the upload middleware to handle video compression
const trainingMediaUpload = (req, res, next) => {
  trainingUpload.fields(uploadFields)(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ message: err.message });
    }

    try {
      // Handle video compression if present
      if (req.files?.image?.[0]?.mimetype.startsWith("video/")) {
        const inputPath = req.files.image[0].path;
        const outputPath = inputPath.replace(/\.[^/.]+$/, "_compressed.mp4");

        await compressVideo(inputPath, outputPath);
        req.files.image[0].path = outputPath;
      }
      next();
    } catch (error) {
      console.error("Video compression error:", error);
      return res.status(500).json({ message: "Error processing video upload" });
    }
  });
};

///// ROUTES /////
// Route for uploading to the profile images
router.post(
  "/profile-images",
  protect,
  profileImageUpload.single("file"),
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { image: req.file.path } },
        {
          new: true,
          runValidators: true,
        }
      );

      res.send({
        message: "File uploaded successfully to images",
        file: `${req.file.path}`,
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error while saving image", error);

      return res.status(500).json({ error });
    }
  }
);

// Route for uploading to the category images
router.post(
  "/category-images",
  protect,
  categoryImageUpload.single("file"),
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { image: req.file.path } },
        {
          new: true,
          runValidators: true,
        }
      );

      res.send({
        message: "File uploaded successfully to images",
        file: `${req.file.path}`,
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error while saving image", error);

      return res.status(500).json({ error });
    }
  }
);

// Route for uploading to the training images
router.post(
  "/training-images",
  protect,
  trainingImageUpload.single("image"),
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { image: req.file.path } },
        {
          new: true,
          runValidators: true,
        }
      );

      res.send({
        message: "File uploaded successfully to images",
        file: `${req.file.path}`,
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error while saving image", error);

      return res.status(500).json({ error });
    }
  }
);

// Route for uploading to the training files
router.post(
  "/training-files",
  protect,
  trainingFileUpload.single("file"),
  async (req, res) => {
    try {
      const trainingFile = await Training.findByIdAndUpdate(
        req.training.id,
        { $set: { image: req.file.path } },
        {
          new: true,
          runValidators: true,
        }
      );

      res.send({
        message: "File uploaded successfully to files",
        file: `${req.file.path}`,
        training: trainingFile,
      });
    } catch (error) {
      console.log("Error while saving file", error);

      return res.status(500).json({ error });
    }
  }
);

module.exports = {
  router,
  profileImageUpload,
  categoryImageUpload,
  trainingImageUpload: singleUpload,
  trainingFileUpload,
  trainingMediaUpload,
  trainingUpload: trainingUpload.fields(uploadFields),
};
