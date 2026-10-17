const Student = require("../models/Student");

const criteria = [
  ["minTenthPercentage", 0, 100],
  ["minTwelfthPercentage", 0, 100],
  ["minUgCgpa", 0, 10],
  ["minPgCgpa", 0, 10],
  ["maxBacklogs", 0, Number.MAX_SAFE_INTEGER],
];

const shortlistStudents = async (req, res) => {
  try {
    const values = {};
    for (const [name, min, max] of criteria) {
      const value = req.body[name] === undefined || req.body[name] === ""
        ? name === "maxBacklogs" ? 0 : min
        : Number(req.body[name]);
      if (!Number.isFinite(value) || value < min || value > max) {
        return res.status(400).json({
          success: false,
          error: `${name} must be a valid number between ${min} and ${max}`,
        });
      }
      values[name] = value;
    }

    const query = {
      tenthPercentage: { $gte: values.minTenthPercentage },
      twelfthPercentage: { $gte: values.minTwelfthPercentage },
      ugCgpa: { $gte: values.minUgCgpa },
      pgCgpa: { $gte: values.minPgCgpa },
      activeBacklogs: { $lte: values.maxBacklogs },
    };

    const shortlisted = await Student.find(query).sort({ ugCgpa: -1, pgCgpa: -1 });

    return res.status(200).json({
      success: true,
      count: shortlisted.length,
      data: shortlisted,
    });
  } catch (err) {
    console.error("Shortlist generation failed", err);
    return res.status(500).json({
      success: false,
      error: "Server error while generating shortlist",
    });
  }
};

module.exports = { shortlistStudents };
