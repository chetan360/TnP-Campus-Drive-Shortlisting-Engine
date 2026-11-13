// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    tenthPercentage: { type: Number, required: true },
    twelfthPercentage: { type: Number, required: true },
    ugCgpa: { type: Number, required: true },
    pgCgpa: { type: Number, required: true },
    resumeLink: { type: String, required: true },
    activeBacklogs: { type: Number, default: 0 },
    appliedDrives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
