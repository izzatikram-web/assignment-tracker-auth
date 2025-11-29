const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    provider: String,      // "google" or "github"
    providerId: String,    // id from Google/GitHub
    displayName: String,   // name shown in navbar
    email: String,         // user email if available
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
