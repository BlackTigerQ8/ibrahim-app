const express = require("express");
const {
  getAllTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
} = require("../controllers/trainingController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllTrainings)
  .post(protect, restrictTo("Admin"), createTraining);

router
  .route("/:id")
  .get(protect, getTrainingById)
  .patch(protect, restrictTo("Admin"), updateTraining)
  .delete(protect, restrictTo("Admin"), deleteTraining);

module.exports = router;
