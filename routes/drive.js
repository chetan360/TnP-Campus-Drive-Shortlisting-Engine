const express = require("express");
const router = express.Router();
const driveController = require("../controllers/driveController");
const { isLoggedIn } = require("../middleware");

// Public drive listings
router.get("/", driveController.getAllDrives);

// Create new drive (Form & Submit) - Admin Only
router.get("/new", isLoggedIn, driveController.renderNewDriveForm);
router.post("/", isLoggedIn, driveController.createDrive);

// Results page
router.get("/results", driveController.renderPublicResults);

// Specific drive shortlisting result - Admin Only
router.get("/:id/shortlist", isLoggedIn, driveController.renderDriveShortlist);

// Edit existing drive - Admin Only
router.get("/:id/edit", isLoggedIn, driveController.renderEditDriveForm);
router.put("/:id", isLoggedIn, driveController.updateDrive);

// Delete drive - Admin Only
router.delete("/:id", isLoggedIn, driveController.deleteDrive);

// Student application routes
router.get("/:id/apply", driveController.renderApplyForm);
router.post("/:id/apply", driveController.submitApplication);

module.exports = router;
