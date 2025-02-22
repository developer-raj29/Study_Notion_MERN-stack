const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  gender: {
    type: String,
    trim: true,
  },
  dateofBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
