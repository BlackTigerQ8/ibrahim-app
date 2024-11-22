const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Training name is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Training description is required"],
  },
  numberOfRepeats: {
    type: Number,
    required: [true, "Number of repeats is required"],
    min: [1, "Number of repeats must be at least 1"],
  },
  numberOfSets: {
    type: Number,
    required: [true, "Number of sets is required"],
    min: [1, "Number of sets must be at least 1"],
  },
  restBetweenSets: {
    type: Number,
    required: [true, "Rest time between sets is required"],
    min: [0, "Rest time between sets cannot be negative"],
  },
  restBetweenRepeats: {
    type: Number,
    required: [true, "Rest time between repeats is required"],
    min: [0, "Rest time between repeats cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Training", trainingSchema);
