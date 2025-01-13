const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Athlete is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    training: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Training",
      required: [true, "Training is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better performance
scheduleSchema.index({ athlete: 1, date: 1 });
scheduleSchema.index({ status: 1 });

module.exports = mongoose.model("Schedule", scheduleSchema);
