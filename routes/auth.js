const renderReact = require("../utils/renderReact");
const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const {
  addUsername,
  usernameExists,
} = require("../utils/usernameBloomFilter");

const router = express.Router();

router.get("/login", (req, res) => renderReact(res, "Login"));
router.get("/signup", (req, res) => renderReact(res, "Signup"));

router.get("/check-username", async (req, res, next) => {
  try {
    const username = String(req.query.username || "").trim();
    if (username.length < 3) {
      return res.status(400).json({
        available: false,
        message: "Username must contain at least 3 characters.",
      });
    }

    const exists = await usernameExists(User, username);
    return res.json({
      available: !exists,
      message: exists
        ? "This username is already registered."
        : "Username is available.",
    });
  } catch (err) {
    return next(err);
  }
});

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
    const username = String(req.body.username || "").trim();
    const { email, password } = req.body;
    if (!username || !email || !password) {
      req.flash("error", "Username, email, and password are required.");
      return res.redirect("/auth/signup");
    }
    if (username.length < 3) {
      req.flash("error", "Username must contain at least 3 characters.");
      return res.redirect("/auth/signup");
    }
    if (await usernameExists(User, username)) {
      req.flash("error", "Username already exists. Please choose another one.");
      return res.redirect("/auth/signup");
    }
    const user = new User({ username, email });
    user.setPassword(password);
    await user.save();
    addUsername(username);
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Admin account created successfully!");
      return res.redirect("/admin/dashboard");
    });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.username) {
      req.flash("error", "Username already exists. Please choose another one.");
      return res.redirect("/auth/signup");
    }
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
