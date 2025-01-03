const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllusers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }

    // Check if the user is accessing their own data or is an admin
    if (req.user.id !== req.params.id && req.user.role !== "Admin") {
      return res.status(403).json({
        status: "Error",
        message: "You do not have permission to access this user's data",
      });
    }

    res.status(200).json({
      stauts: "Success",
      data: { ...user._doc, imagePath: user.image },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const uploadedFile = req.file;
    const filePath = uploadedFile ? uploadedFile.path : null;
    const newUser = await User.create({ ...req.body, image: filePath });
    res.status(201).json({
      status: "Success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    // Check if the user is accessing their own data or is an admin
    if (req.user.id !== req.params.id && req.user.role !== "Admin") {
      return res.status(403).json({
        status: "Error",
        message: "You do not have permission to access this user's data",
      });
    }

    const uploadedFile = req.file;
    const filePath = uploadedFile ? uploadedFile.path : null;

    // Prepare the updated data
    const updateData = req.file
      ? { ...req.body, image: filePath }
      : { ...req.body };

    // Check if password is included in the request body and hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
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

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "Error",
        message: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "Error",
        message: "Invalid email or password",
      });
    }

    // Convert the Mongoose document to a plain JavaScript object
    const userObj = user.toObject();

    // Destructure the necessary properties
    const { firstName, lastName, email: userEmail, _id, role, image } = userObj;

    // Create token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({
      status: "Success",
      token,
      data: {
        user: { firstName, lastName, email: userEmail, _id, role, image },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res
    .status(200)
    .json({ status: "Success", message: "Logged out successfully" });
};

module.exports = {
  getAllusers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
};
