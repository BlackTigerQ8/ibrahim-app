const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { User } = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");
const iconv = require("iconv-lite");

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
    cb(null, getUploadFileName(file));
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

// Training image upload instance
const trainingImageUpload = multer({
  storage: trainingImages,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb, "training images");
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
  const filetypes = /pdf|jpeg|jpg|png/;
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
  trainingImageUpload,
  trainingFileUpload,
  trainingUpload: trainingUpload.fields(uploadFields),
};
