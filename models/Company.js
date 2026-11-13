// models/Company.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    criteria: {
      minTenthPercentage: { type: Number, required: true },
      minTwelfthPercentage: { type: Number, required: true },
      minUgCgpa: { type: Number, required: true },
      minPgCgpa: { type: Number, required: true },
      maxBacklogs: { type: Number, default: 0 },
    },
    package: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Company", companySchema);
