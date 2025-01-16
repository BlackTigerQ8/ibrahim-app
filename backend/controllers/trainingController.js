const Training = require("../models/TrainingModel");
const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");

// @desc    Get all trainings
// @route   GET /api/trainings
// @access  Private/Admin
const getAllTrainings = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const query = categoryId ? { category: categoryId } : {};
    const trainings = await Training.find(query).populate("category");
    res.status(200).json({
      status: "Success",
      data: {
        trainings,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Get single training by ID
// @route   GET /api/trainings/:id
// @access  Private/Admin
const getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id).populate(
      "category"
    );

    if (!training) {
      return res.status(404).json({
        status: "Error",
        message: "Training not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        training,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Create a new training
// @route   POST /api/trainings
// @access  Private/Admin
const createTraining = async (req, res) => {
  try {
    console.log("Hello");
    const {
      name,
      description,
      numberOfRepeats,
      numberOfSets,
      restBetweenSets,
      restBetweenRepeats,
      category,
    } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid category ID",
      });
    }

    // Check if the category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({
        status: "Error",
        message: "Category not found",
      });
    }

    // const uploadedFile = req.file;
    // const filePath = uploadedFile ? uploadedFile.path : null;
    // const uploadedImage = req.file;
    // const imagePath = uploadedImage ? uploadedImage.path : null;

    const image = req.files?.image?.[0]?.path || null;
    const file = req.files?.file?.[0]?.path || null;

    const training = await Training.create({
      name,
      description,
      numberOfRepeats,
      numberOfSets,
      restBetweenSets,
      restBetweenRepeats,
      category,
      file,
      image,
    });

    res.status(201).json({
      status: "Success",
      data: {
        training,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Update a training
// @route   PUT /api/trainings/:id
// @access  Private/Admin
const updateTraining = async (req, res) => {
  try {
    const {
      name,
      description,
      numberOfRepeats,
      numberOfSets,
      restBetweenSets,
      restBetweenRepeats,
      category,
    } = req.body;

    // Validate category if provided
    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({
          status: "Error",
          message: "Category not found",
        });
      }
    }

    const updatedTraining = await Training.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        numberOfRepeats,
        numberOfSets,
        restBetweenSets,
        restBetweenRepeats,
        category,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTraining) {
      return res.status(404).json({
        status: "Error",
        message: "Training not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        training: updatedTraining,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Delete a training
// @route   DELETE /api/trainings/:id
// @access  Private/Admin
const deleteTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);

    if (!training) {
      return res.status(404).json({
        status: "Error",
        message: "Training not found",
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
  getAllTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
};
