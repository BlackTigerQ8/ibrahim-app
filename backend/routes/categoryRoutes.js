const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { categoryImageUpload } = require("./uploadRoutes");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllCategories)
  .post(
    protect,
    restrictTo("Admin", "Coach"),
    categoryImageUpload.single("image"),
    createCategory
  );

router
  .route("/:id")
  .get(protect, restrictTo("Admin", "Coach"), getCategoryById)
  .patch(
    protect,
    restrictTo("Admin", "Coach"),
    categoryImageUpload.single("image"),
    updateCategory
  )
  .delete(protect, restrictTo("Admin", "Coach"), deleteCategory);

module.exports = router;
