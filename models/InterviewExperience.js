const mongoose = require("mongoose");

const interviewExperienceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 20000,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "InterviewExperience",
  interviewExperienceSchema,
);
