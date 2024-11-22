const mongoose = require("mongoose");
const { USER_ROLES } = require("./userModel");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Category description is required"],
  },
  role: {
    type: [String],
    enum: USER_ROLES,
    required: [true, "A specified role is required for access"],
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", categorySchema);
