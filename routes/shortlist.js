const express = require("express");
const router = express.Router();
const {
  shortlistStudents,
  renderShortlistPage,
} = require("../controllers/shortlistController");
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, (req, res, next) => {
  if (req.query.format === "json" || req.headers.accept === "application/json") {
    return res.status(200).json({
      success: true,
      message: "Submit shortlist criteria with POST /shortlist.",
    });
  }
  return renderShortlistPage(req, res, next);
});

router.post("/", isLoggedIn, shortlistStudents);

module.exports = router;
