const Schedule = require("../models/scheduleModel");
const { User } = require("../models/userModel");
const mongoose = require("mongoose");

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Private
const getAllSchedules = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "Coach") {
      // First get all athletes assigned to this coach
      const assignedAthletes = await User.find({ coach: req.user._id }).select(
        "_id"
      );
      const athleteIds = assignedAthletes.map((athlete) => athlete._id);

      // Then filter schedules for these athletes
      query.athlete = { $in: athleteIds };
    } else if (req.user.role !== "Admin") {
      // For athletes/family members, show only their own schedules
      query.athlete = req.user._id;
    }

    const schedules = await Schedule.find(query)
      .populate("athlete", "firstName lastName")
      .populate("category", "name")
      .populate("training", "name description");

    res.status(200).json({
      status: "Success",
      data: { schedules },
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Get single schedule
// @route   GET /api/schedules/:id
// @access  Private
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("athlete", "firstName lastName")
      .populate("category", "name")
      .populate("training", "name description");

    if (!schedule) {
      return res.status(404).json({
        status: "Error",
        message: "Schedule not found",
      });
    }

    // Check access rights
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Coach" &&
      schedule.athlete._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        status: "Error",
        message: "Not authorized to access this schedule",
      });
    }

    res.status(200).json({
      status: "Success",
      data: { schedule },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Create new schedule
// @route   POST /api/schedules
// @access  Private/Admin/Coach
const createSchedule = async (req, res) => {
  try {
    const { athlete, category, training, date, notes } = req.body;
    if (req.user.role !== "Admin" && req.user.role !== "Coach") {
      return res.status(403).json({
        status: "Error",
        message: "Not authorized to create schedules",
      });
    }

    const schedule = await Schedule.create({
      athlete,
      category,
      training,
      date,
      notes,
    });

    res.status(201).json({
      status: "Success",
      data: { schedule },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
// @access  Private/Admin/Coach
const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        status: "Error",
        message: "Schedule not found",
      });
    }

    if (req.user.role !== "Admin" && req.user.role !== "Coach") {
      return res.status(403).json({
        status: "Error",
        message: "Not authorized to update schedules",
      });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "Success",
      data: { schedule: updatedSchedule },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Update schedule status
// @route   PATCH /api/schedules/:id/status
// @access  Private
const updateScheduleStatus = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        status: "Error",
        message: `Schedule not found with ID: ${req.params.id}`,
      });
    }

    // Check if the user is authorized to update this schedule
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Coach" &&
      schedule.athlete.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: "Error",
        message: "You can only update your own schedule status",
      });
    }

    // Update only the status field
    schedule.status = req.body.status;
    await schedule.save();

    // Fetch the populated schedule to return
    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate("athlete", "firstName lastName")
      .populate("category", "name")
      .populate("training", "name description");

    res.status(200).json({
      status: "Success",
      data: {
        schedule: populatedSchedule,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin/Coach
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        status: "Error",
        message: "Schedule not found",
      });
    }

    if (req.user.role !== "Admin" && req.user.role !== "Coach") {
      return res.status(403).json({
        status: "Error",
        message: "Not authorized to delete schedules",
      });
    }

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  updateScheduleStatus,
};
