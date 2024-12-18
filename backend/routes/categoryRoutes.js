const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllCategories)
  .post(protect, restrictTo("Admin"), createCategory);

router
  .route("/:id")
  .get(protect, restrictTo("Admin"), getCategoryById)
  .patch(protect, restrictTo("Admin"), updateCategory)
  .delete(protect, restrictTo("Admin"), deleteCategory);

module.exports = router;
