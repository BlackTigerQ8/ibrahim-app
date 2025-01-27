const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const USER_ROLES = ["Admin", "Family", "Coach", "Athlete"];

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "You need to enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "You need to enter your last name"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Email is required for future login"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  phone: {
    type: Number,
    required: [true, "Phone number is required"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  role: {
    type: String,
    enum: USER_ROLES,
    required: true,
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.role === "Athlete";
    },
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your passowrd"],
    // This validator only works on CREATE and SAVE!!!
    validate: {
      validator: function (input) {
        return input === this.password;
      },
      message: "Passwords did not match!",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Mongoose middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  //   Delete passwordConfirm field
  this.confirmPassword = undefined;

  // To remove commas from identification number
  if (this.identification && typeof this.identification === "string") {
    this.identification = this.identification.replace(/,/g, "");
  }
  next();
});

// Method to generate verification token
userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

module.exports = { User: mongoose.model("User", userSchema), USER_ROLES };
