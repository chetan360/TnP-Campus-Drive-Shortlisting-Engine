const Student = require("../models/Student");
const Company = require("../models/Company");

const criteriaConfig = [
  ["minTenthPercentage", 0, 100],
  ["minTwelfthPercentage", 0, 100],
  ["minUgCgpa", 0, 10],
  ["minPgCgpa", 0, 10],
  ["maxBacklogs", 0, Number.MAX_SAFE_INTEGER],
];

// Render interactive shortlisting tool for admin
const renderShortlistPage = async (req, res, next) => {
  try {
    const drives = await Company.find({}).sort({ name: 1 });
    res.render("shortlist/index", {
      drives,
      criteria: {
        minTenthPercentage: 60,
        minTwelfthPercentage: 60,
        minUgCgpa: 6.5,
        minPgCgpa: 6.5,
        maxBacklogs: 0,
      },
      shortlisted: null,
      selectedDriveId: "",
    });
  } catch (err) {
    next(err);
  }
};

const shortlistStudents = async (req, res) => {
  try {
    const values = {};
    for (const [name, min, max] of criteriaConfig) {
      const value =
        req.body[name] === undefined || req.body[name] === ""
          ? name === "maxBacklogs"
            ? 0
            : min
          : Number(req.body[name]);
      if (!Number.isFinite(value) || value < min || value > max) {
        if (req.xhr || req.headers.accept?.includes("application/json")) {
          return res.status(400).json({
            success: false,
            error: `${name} must be a valid number between ${min} and ${max}`,
          });
        }
        req.flash("error", `${name} must be a valid number between ${min} and ${max}`);
        return res.redirect("/shortlist");
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

    if (req.body.driveId) {
      const drive = await Company.findById(req.body.driveId);
      if (drive) {
        const hasSpecificApplicants = await Student.exists({
          appliedDrives: drive._id,
        });
        if (hasSpecificApplicants) {
          query.appliedDrives = drive._id;
        }
      }
    }

    const shortlisted = await Student.find(query).sort({
      ugCgpa: -1,
      pgCgpa: -1,
    });

    // Check if JSON response is requested
    if (req.xhr || req.headers.accept?.includes("application/json") || req.query.format === "json") {
      return res.status(200).json({
        success: true,
        count: shortlisted.length,
        data: shortlisted,
      });
    }

    // Otherwise render web page with shortlisted results
    const drives = await Company.find({}).sort({ name: 1 });
    return res.render("shortlist/index", {
      drives,
      criteria: values,
      shortlisted,
      selectedDriveId: req.body.driveId || "",
    });
  } catch (err) {
    console.error("Shortlist generation failed", err);
    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.status(500).json({
        success: false,
        error: "Server error while generating shortlist",
      });
    }
    req.flash("error", "Server error while generating shortlist.");
    return res.redirect("/shortlist");
  }
};

module.exports = { shortlistStudents, renderShortlistPage };
