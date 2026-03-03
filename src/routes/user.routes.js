const express  = require("express");
const router   = express.Router();
const protect  = require("../middleware/auth.middleware");
const User     = require("../models/user.model");

// ─────────────────────────────────────────────
// GET /api/users
// List all users (so you can find who to message)
// Returns: id, name, email, avatar — no passwords
// ─────────────────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } }          // everyone except yourself
    ).select("_id name email avatar isVerified provider createdAt");

    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/users/email/:email
// Find a specific user by email
// ─────────────────────────────────────────────
router.get("/email/:email", protect, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .select("_id name email avatar isVerified provider");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/users/me
// Delete own account (must be logged in)
// ─────────────────────────────────────────────
router.delete("/me", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    // Clear cookie on delete
    res.clearCookie("token");

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;