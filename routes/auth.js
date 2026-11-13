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
    req.flash("success", "Welcome back to TnP Admin Dashboard!");
    const redirectUrl = req.session.redirectUrl || "/admin/dashboard";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
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
      req.flash("success", "Admin account created successfully!");
      return res.redirect("/admin/dashboard");
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
    req.flash("success", "Logged in with Google successfully!");
    return res.redirect("/admin/dashboard");
  });
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out successfully.");
    return res.redirect("/auth/login");
  });
});

module.exports = router;
