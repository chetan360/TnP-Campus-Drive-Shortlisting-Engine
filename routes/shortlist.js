const express = require("express");
const router = express.Router();
const { shortlistStudents } = require("../controllers/shortlistController");
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Submit shortlist criteria with POST /shortlist.",
  });
});
router.post("/", isLoggedIn, shortlistStudents);

module.exports = router;
