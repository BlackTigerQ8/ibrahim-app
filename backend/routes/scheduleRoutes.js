const express = require("express");
const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  updateScheduleStatus,
} = require("../controllers/scheduleController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllSchedules)
  .post(protect, restrictTo("Admin", "Coach"), createSchedule);

router.route("/:id/status").patch(protect, updateScheduleStatus);

router
  .route("/:id")
  .get(protect, getScheduleById)
  .patch(protect, restrictTo("Admin", "Coach"), updateSchedule)
  .delete(protect, restrictTo("Admin", "Coach"), deleteSchedule);

module.exports = router;
