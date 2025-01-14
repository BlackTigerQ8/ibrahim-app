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

// Add index for better query performance
scheduleSchema.index({ athlete: 1, date: 1 });

// Improve pre-save middleware
scheduleSchema.pre("save", async function (next) {
  try {
    // Validate ObjectIds
    const fields = ["athlete", "category", "training"];
    for (const field of fields) {
      if (!mongoose.Types.ObjectId.isValid(this[field])) {
        throw new Error(`Invalid ${field} ID`);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Add error handling for required fields
scheduleSchema.pre("validate", function (next) {
  if (!this.date) {
    next(new Error("Date is required"));
  }
  next();
});

module.exports = mongoose.model("Schedule", scheduleSchema);
