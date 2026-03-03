const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");

// =========================================
// PUBLIC ROUTES (no auth needed)
// =========================================

// Register with email + password
router.post("/signup", authController.registerUser);

// Login with email + password
router.post("/login", authController.loginWithPassword);

// Request OTP to email
router.post("/send-otp", authController.sendOTP);

// Verify OTP and login
router.post("/verify-otp", authController.verifyOTP);

// Logout (clear cookie)
router.post("/logout", authController.logout);

// =========================================
// GOOGLE OAUTH ROUTES
// =========================================

// Step 1: Redirect user to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"] // what we want from Google
  })
);

// Step 2: Google redirects back here after login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false // We use JWT not sessions after OAuth
  }),
  authController.googleCallback
);

// Google OAuth failure handler
router.get("/google/failure", (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

// =========================================
// PROTECTED ROUTES (need valid JWT cookie)
// =========================================

// Get logged-in user profile
router.get("/profile", protect, authController.getProfile);

module.exports = router;