const express = require("express");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();

router.get("/login", (req, res) => res.render("users/login"));
router.get("/signup", (req, res) => res.render("users/signup"));

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect(req.session.redirectUrl || "/shortlist");
    delete req.session.redirectUrl;
  },
);

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      req.flash("error", "Username, email, and password are required.");
      return res.redirect("/auth/signup");
    }
    const user = new User({ username, email });
    user.setPassword(password);
    await user.save();
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/shortlist");
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).send("Google authentication is not configured.");
  }
  return passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );
});
router.get("/google/callback", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).send("Google authentication is not configured.");
  }
  return passport.authenticate("google", {
    failureRedirect: "/auth/login",
  })(req, res, (err) => {
    if (err) return next(err);
    return res.redirect("/shortlist");
  });
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect("/auth/login");
  });
});

module.exports = router;
