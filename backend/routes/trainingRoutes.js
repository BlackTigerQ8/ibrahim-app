const express = require("express");
const {
  getAllTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
} = require("../controllers/trainingController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { trainingUpload, trainingMediaUpload } = require("./uploadRoutes");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllTrainings)
  .post(
    protect,
    trainingMediaUpload,
    restrictTo("Admin", "Coach"),
    createTraining
  );

router
  .route("/:id")
  .get(protect, getTrainingById)
  .patch(
    protect,
    trainingMediaUpload,
    restrictTo("Admin", "Coach"),
    updateTraining
  )
  .delete(protect, restrictTo("Admin", "Coach"), deleteTraining);

module.exports = router;
