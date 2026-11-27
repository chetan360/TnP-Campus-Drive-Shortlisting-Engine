const express = require("express");
const InterviewExperience = require("../models/InterviewExperience");
const renderReact = require("../utils/renderReact");
const ExpressError = require("../utils/ExpressError");

const router = express.Router();

const publicFields = "name content createdAt";

router.get("/", async (req, res, next) => {
  try {
    const experiences = await InterviewExperience.find({})
      .select(publicFields)
      .sort({ createdAt: -1 })
      .lean();
    return renderReact(res, "InterviewExperiences", { experiences });
  } catch (error) {
    return next(error);
  }
});

router.get("/new", (req, res) =>
  renderReact(res, "InterviewExperienceForm"),
);

router.post("/", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim();
    const content = String(req.body.content || "").trim();

    if (!name || !email || !content) {
      req.flash("error", "Name, email, and interview experience are required.");
      return res.redirect("/experiences/new");
    }

    const experience = await InterviewExperience.create({
      name,
      email,
      content,
    });
    req.flash("success", "Thank you! Your interview experience is now live.");
    return res.redirect(`/experiences/${experience._id}`);
  } catch (error) {
    if (error.name === "ValidationError") {
      req.flash(
        "error",
        Object.values(error.errors)[0]?.message || "Please check your details.",
      );
      return res.redirect("/experiences/new");
    }
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id)
      .select(publicFields)
      .lean();
    if (!experience) {
      return next(new ExpressError(404, "Interview experience not found."));
    }
    return renderReact(res, "InterviewExperienceDetail", { experience });
  } catch (error) {
    if (error.name === "CastError") {
      return next(new ExpressError(404, "Interview experience not found."));
    }
    return next(error);
  }
});

module.exports = router;
