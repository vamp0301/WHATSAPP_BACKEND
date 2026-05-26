// ===============================
// IMPORTS (ONLY ONCE AT TOP)
// ===============================
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/email.service");
const generateOtp = require("../utils/generateOtp");
// ===============================
// HELPER: Create & send JWT cookie
// ===============================
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,           // JS cannot access this cookie (XSS protection)
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });

  return token;
};
// ===============================
// REGISTER USER
// ===============================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      provider: "local"
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


// ===============================
// LOGIN WITH PASSWORD
// ===============================
exports.loginWithPassword = async (req, res) => {
  try{
  const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await User.findOne({ email });

    if (!user || !user.password)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🔐 Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
  message: "Login successful",
  token
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// SEND OTP
// ===============================
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ Use shared utility for OTP generation
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({ email });

    if (!user) {
      // Create minimal user record to hold OTP
      user = await User.create({ email, provider: "local" });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // ✅ FIXED: Actually send the OTP via email
    await sendEmail(
      email,
      "Your OTP Code - WhatsApp Clone",
      `Your OTP is: ${otp}\n\nThis OTP will expire in 5 minutes.\nDo not share this with anyone.`
    );

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error("SendOTP Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};



// ===============================
// VERIFY OTP
// ===============================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // ✅ Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;
    await user.save();

    // ✅ Send JWT cookie
    sendTokenCookie(res, user._id);

    res.json({
      message: "OTP verified. Login successful.",
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("VerifyOTP Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
// ===============================
// GOOGLE OAUTH CALLBACK
// ✅ NEW: Was missing entirely before
// ===============================
exports.googleCallback = async (req, res) => {
  try {
    // req.user is set by passport after successful OAuth
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }

    // ✅ Issue JWT cookie for this Google-authenticated user
    sendTokenCookie(res, user._id);

    // Redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}/chat`);

  } catch (error) {
    console.error("Google Callback Error:", error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};

// ===============================
// LOGOUT
// ✅ NEW: Was missing entirely before
// ===============================
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  res.json({ message: "Logged out successfully" });
};

// ===============================
// GET PROFILE (used in protected route)
// ===============================
exports.getProfile = async (req, res) => {
  try {
    res.json({
      message: "Profile fetched successfully",
      user: req.user // set by protect middleware
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};