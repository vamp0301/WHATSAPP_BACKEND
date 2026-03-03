/*DATA BASE CONNECTION */


// Import mongoose using require
const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect using connection string from .env file
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);

    // Exit process if DB connection fails
    process.exit(1);
  }
};

// Export function so it can be used in server.js
module.exports = connectDB;