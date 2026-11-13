const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user.js");
const authRouter = require("./routes/auth");
const shortlistingRouter = require("./routes/shortlist");
const driveRouter = require("./routes/drive");
const { getAdminDashboard, submitApplication } = require("./controllers/driveController");
const { isLoggedIn, saveRedirectUrl } = require("./middleware");
const ExpressError = require("./utils/ExpressError");

const dbUrl = process.env.DB_URL;
if (!dbUrl || !process.env.SECRET) {
  throw new Error("DB_URL and SECRET must be configured");
}

async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in Mongo Session Store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(saveRedirectUrl);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.messages = req.flash();
  next();
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user || !(await user.verifyPassword(password))) {
        return done(null, false, { message: "Invalid username or password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              username: profile.displayName,
              email: profile.emails?.[0]?.value,
              googleId: profile.id,
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Primary Home Route
app.get("/", (req, res) => {
  res.render("home");
});

// Mount Feature Routers
app.use("/auth", authRouter);
app.use("/shortlist", shortlistingRouter);
app.use("/drives", driveRouter);

// Drive route aliases
app.get("/drive/apply", (req, res) => res.redirect("/drives"));
app.get("/drive/result", (req, res) => res.redirect("/drives/results"));
app.get("/drive/apply/:id", (req, res) => res.redirect(`/drives/${req.params.id}/apply`));
app.post("/drive/apply/:id", submitApplication);

// Admin dashboard shortcut route
app.get("/admin/dashboard", isLoggedIn, getAdminDashboard);

// 404 Catch-all handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message = "Something went wrong." } = err;
  res.status(statusCode).render("error", {
    message: err.message || message,
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

module.exports = app;
