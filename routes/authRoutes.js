require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const session = require('express-session');
router.use(session({secret:"tasks"}));
router.use(passport.initialize());
router.use(passport.session());
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

router.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return done(err, user);
      //   });
    }
  )
);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  
  router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return next(err);
      }
      res.redirect("http://localhost:5173/"); // Redirect to the home page or any other page after logout
    });
  });
  // Define the callback route for Google authentication
  router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }
      if (!user) {
        console.error("Authentication failed:", info);
        return res.redirect("/auth/google");
      }
  
      // Log email and profile data
      console.log("Email:", user.emails[0].value);
      console.log("Profile:", user.displayName);
      
      // Redirect or render a response as needed
      res.redirect("http://localhost:5173/"); // Redirect to home page, for example
    })(req, res, next);
  });

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = router;
