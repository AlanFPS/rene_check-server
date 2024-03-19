const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePictureUrl: {
      type: String,
      required: false,
    },
    isIdVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // The timestamps option adds createdAt and updatedAt fields

// Create and export the user model
const User = mongoose.model("User", userSchema);
module.exports = User;
