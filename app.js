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
const { saveRedirectUrl } = require("./middleware");

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
    console.log(err);
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
  saveUninitialized: true,
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
  }),
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
      },
    ),
  );
}

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Fetch the user from the database
    done(null, user); // Pass the user to the done callback
  } catch (err) {
    done(err, null); // Handle any potential errors by passing them to done
  }
});

app.use(methodOverride("_method"));
app.use("/auth", authRouter);
app.use("/shortlist", shortlistingRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).render("error", {
    message: "Something went wrong.",
  });
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log("server is listening on 3000");
  });
}

app.get("/", (req, res) => {
  res.render("home");
});

module.exports = app;
