const renderReact = require("../utils/renderReact");
const Company = require("../models/Company");
const Student = require("../models/Student");

// Display all campus drives (Public / Student view)
const getAllDrives = async (req, res, next) => {
  try {
    const companies = await Company.find({}).sort({ deadline: 1 });
    renderReact(res, "DriveCatalog", { companies });
  } catch (err) {
    next(err);
  }
};

// Admin Dashboard - View all drives with management actions and statistics
const getAdminDashboard = async (req, res, next) => {
  try {
    const drives = await Company.find({}).sort({ createdAt: -1 });
    const totalStudents = await Student.countDocuments();
    const activeDrivesCount = await Company.countDocuments({
      deadline: { $gte: new Date() },
    });

    // Count applicants per drive
    const drivesWithApplicantCount = await Promise.all(
      drives.map(async (drive) => {
        const applicantCount = await Student.countDocuments({
          appliedDrives: drive._id,
        });
        return {
          ...drive.toObject(),
          applicantCount,
        };
      })
    );

    renderReact(res, "Dashboard", {
      drives: drivesWithApplicantCount,
      totalStudents,
      totalDrives: drives.length,
      activeDrivesCount,
    });
  } catch (err) {
    next(err);
  }
};

// Render form to create a new drive
const renderNewDriveForm = (req, res) => {
  renderReact(res, "DriveForm");
};

// Create a new drive in database
const createDrive = async (req, res, next) => {
  try {
    const {
      name,
      role,
      package: pkg,
      description,
      deadline,
      minTenthPercentage,
      minTwelfthPercentage,
      minUgCgpa,
      minPgCgpa,
      maxBacklogs,
    } = req.body;

    if (!name || !role || !pkg || !description || !deadline) {
      req.flash("error", "Please fill in all required drive details.");
      return res.redirect("/drives/new");
    }

    const newCompany = new Company({
      name,
      role,
      package: pkg,
      description,
      deadline: new Date(deadline),
      criteria: {
        minTenthPercentage: Number(minTenthPercentage) || 0,
        minTwelfthPercentage: Number(minTwelfthPercentage) || 0,
        minUgCgpa: Number(minUgCgpa) || 0,
        minPgCgpa: Number(minPgCgpa) || 0,
        maxBacklogs: Number(maxBacklogs) || 0,
      },
    });

    await newCompany.save();
    req.flash("success", `Drive for ${name} created successfully!`);
    res.redirect("/admin/dashboard");
  } catch (err) {
    next(err);
  }
};

// Render form to edit an existing drive
const renderEditDriveForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const drive = await Company.findById(id);
    if (!drive) {
      req.flash("error", "Drive not found.");
      return res.redirect("/admin/dashboard");
    }
    renderReact(res, "DriveForm", { drive });
  } catch (err) {
    next(err);
  }
};

// Update existing drive details
const updateDrive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      package: pkg,
      description,
      deadline,
      minTenthPercentage,
      minTwelfthPercentage,
      minUgCgpa,
      minPgCgpa,
      maxBacklogs,
    } = req.body;

    const updatedData = {
      name,
      role,
      package: pkg,
      description,
      deadline: new Date(deadline),
      criteria: {
        minTenthPercentage: Number(minTenthPercentage) || 0,
        minTwelfthPercentage: Number(minTwelfthPercentage) || 0,
        minUgCgpa: Number(minUgCgpa) || 0,
        minPgCgpa: Number(minPgCgpa) || 0,
        maxBacklogs: Number(maxBacklogs) || 0,
      },
    };

    const drive = await Company.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!drive) {
      req.flash("error", "Drive not found.");
      return res.redirect("/admin/dashboard");
    }

    req.flash("success", `Drive for ${drive.name} updated successfully!`);
    res.redirect("/admin/dashboard");
  } catch (err) {
    next(err);
  }
};

// Delete a drive
const deleteDrive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedDrive = await Company.findByIdAndDelete(id);
    if (!deletedDrive) {
      req.flash("error", "Drive not found.");
      return res.redirect("/admin/dashboard");
    }

    // Remove reference from student appliedDrives
    await Student.updateMany(
      { appliedDrives: id },
      { $pull: { appliedDrives: id } }
    );

    req.flash("success", `Drive for ${deletedDrive.name} deleted successfully!`);
    res.redirect("/admin/dashboard");
  } catch (err) {
    next(err);
  }
};

// Render application form for a specific drive
const renderApplyForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const drive = await Company.findById(id);
    if (!drive) {
      req.flash("error", "Drive not found or has been closed.");
      return res.redirect("/drives");
    }
    renderReact(res, "Application", { drive });
  } catch (err) {
    next(err);
  }
};

// Handle student application submission
const submitApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const drive = await Company.findById(id);
    if (!drive) {
      req.flash("error", "Drive does not exist.");
      return res.redirect("/drives");
    }

    const {
      name,
      rollNo,
      branch,
      tenthPercentage,
      twelfthPercentage,
      ugCgpa,
      pgCgpa,
      resumeLink,
      activeBacklogs,
    } = req.body;

    if (!name || !rollNo || !branch || !resumeLink) {
      req.flash("error", "Please complete all required application fields.");
      return res.redirect(`/drive/apply/${id}`);
    }

    let student = await Student.findOne({ rollNo: rollNo.trim() });
    if (student) {
      // Update existing student details and add drive to appliedDrives if not already there
      student.name = name;
      student.branch = branch;
      student.tenthPercentage = Number(tenthPercentage);
      student.twelfthPercentage = Number(twelfthPercentage);
      student.ugCgpa = Number(ugCgpa);
      student.pgCgpa = Number(pgCgpa);
      student.resumeLink = resumeLink;
      student.activeBacklogs = Number(activeBacklogs) || 0;
      if (!student.appliedDrives.includes(drive._id)) {
        student.appliedDrives.push(drive._id);
      }
      await student.save();
    } else {
      // Create new student record
      student = new Student({
        name,
        rollNo: rollNo.trim(),
        branch,
        tenthPercentage: Number(tenthPercentage),
        twelfthPercentage: Number(twelfthPercentage),
        ugCgpa: Number(ugCgpa),
        pgCgpa: Number(pgCgpa),
        resumeLink,
        activeBacklogs: Number(activeBacklogs) || 0,
        appliedDrives: [drive._id],
      });
      await student.save();
    }

    req.flash(
      "success",
      `Application submitted successfully for ${drive.name} (${drive.role})!`
    );
    res.redirect("/drives");
  } catch (err) {
    next(err);
  }
};

// View shortlisted candidates for a specific drive
const renderDriveShortlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const drive = await Company.findById(id);
    if (!drive) {
      req.flash("error", "Drive not found.");
      return res.redirect("/admin/dashboard");
    }

    const { criteria } = drive;

    // Check if any students applied specifically to this drive
    const appliedCount = await Student.countDocuments({ appliedDrives: drive._id });

    // Filter query: if students applied, only filter among applicants; otherwise filter across student pool
    const query = {
      tenthPercentage: { $gte: criteria.minTenthPercentage },
      twelfthPercentage: { $gte: criteria.minTwelfthPercentage },
      ugCgpa: { $gte: criteria.minUgCgpa },
      pgCgpa: { $gte: criteria.minPgCgpa },
      activeBacklogs: { $lte: criteria.maxBacklogs },
    };

    if (appliedCount > 0) {
      query.appliedDrives = drive._id;
    }

    const shortlistedStudents = await Student.find(query).sort({
      ugCgpa: -1,
      pgCgpa: -1,
    });

    renderReact(res, "DriveShortlist", {
      drive,
      shortlistedStudents,
      filterScope: appliedCount > 0 ? "applicants" : "all_students",
      totalApplicants: appliedCount,
    });
  } catch (err) {
    next(err);
  }
};

// View results of all drives (Student/Public Results view)
const renderPublicResults = async (req, res, next) => {
  try {
    const drives = await Company.find({}).sort({ deadline: -1 });
    renderReact(res, "Results", { drives });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllDrives,
  getAdminDashboard,
  renderNewDriveForm,
  createDrive,
  renderEditDriveForm,
  updateDrive,
  deleteDrive,
  renderApplyForm,
  submitApplication,
  renderDriveShortlist,
  renderPublicResults,
};
