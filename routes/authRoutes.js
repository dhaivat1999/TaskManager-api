require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require('../models/User');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const session = require("express-session");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

router.use(session({ 
  secret: "tasks",
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.json());

// Signup Route
router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    const newUser = await user.save();
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Google Authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // Here you can perform any necessary logic with the Google profile data
      return done(null, profile);
    }
  )
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Compare the password from the database with the password provided by the user
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get("/google/callback", async (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      console.error("Authentication failed:", info);
      return res.redirect("/auth/google");
    }

    try {
      // Check if the user's email exists in the database
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        // User exists in the database, generate JWT token.
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: '1h' });
        // Redirect with token
        
        return res.redirect(`http://localhost:5173/?loggedIn=true&token=${token}`);
      } else {
        // User does not exist in the database, create a new user entry or handle as needed
        // You can create a new user entry here or handle the scenario based on your application's requirements
        // For example, you can redirect the user to a signup page
        return res.redirect("/signup");
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  })(req, res, next);
});

router.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    // Clear the JWT token from the client-side
    res.clearCookie("token");
    // Redirect or respond as needed
    res.redirect("http://localhost:5173"); // Redirect to home page, for example
  });
});



// Serialize and Deserialize user
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = router;
