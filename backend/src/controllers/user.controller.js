const User = require("../models/user.model");

// =====================================
// GET ALL USERS
// =====================================
exports.getUsers = async (req, res) => {

  try {

    const users = await User.find()
      .select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};