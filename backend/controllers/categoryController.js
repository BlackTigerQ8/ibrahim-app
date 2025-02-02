const Category = require("../models/CategoryModel");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private/Admin
const getAllCategories = async (req, res) => {
  try {
    let query = {};

    // Only filter by createdBy if the user is a Coach
    // Admin should see all categories
    if (req.user.role === "Coach") {
      query.createdBy = req.user._id;
    }

    const categories = await Category.find(query).populate(
      "createdBy",
      "firstName lastName role"
    );

    res.status(200).json({
      status: "Success",
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Private/Admin
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "Error",
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Ensure all required fields are provided
    if (!name || !description) {
      return res.status(400).json({
        status: "Error",
        message: "All fields (name, description) are required",
      });
    }

    const image = req.file ? req.file.path : null;
    const category = await Category.create({
      name,
      description,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "Success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const uploadedFile = req.file;
    const filePath = uploadedFile ? uploadedFile.path : null;

    // Prepare the updated data
    const updateData = req.file
      ? { ...req.body, image: filePath }
      : { ...req.body };

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: "Error",
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        category: updatedCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "Error",
        message: "Category not found",
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
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
