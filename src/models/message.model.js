const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // ✅ Who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ✅ Who receives the message
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ✅ Message content
    content: {
      type: String,
      required: [true, "Message content cannot be empty"],
      trim: true
    },

    // ✅ Message type (text, image in future)
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text"
    },

    // ✅ Read status
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // createdAt = message time
  }
);

// ✅ Index to quickly fetch conversation between two users
messageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model("Message", messageSchema);