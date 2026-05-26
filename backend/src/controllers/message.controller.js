const Message = require("../models/message.model");
const User = require("../models/user.model");

// ========================================
// SEND MESSAGE (REST API version)
// ========================================
// WebSocket handles real-time delivery
// This saves message to DB for persistence

// ─────────────────────────────────────────────────────
// POST /api/messages/send
// ─────────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const { receiverEmail, content } = req.body;
    const senderId = req.user._id; // from protect middleware

    if (!receiverEmail || !content) {
      return res.status(400).json({ message: "receiverEmail and content required" });
    }

    // ✅ Find receiver by email
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // ✅ Cannot message yourself
    if (receiver._id.toString() === senderId.toString()) {
      return res.status(400).json({ message: "Cannot send message to yourself" });
    }

    // ✅ Save message to DB
    const message = await Message.create({
      sender: senderId,
      receiver: receiver._id,
      content
    });

    res.status(201).json({
      message: "Message sent",
      data: message
    });

  } catch (error) {
    console.error("SendMessage Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ========================================
// GET CONVERSATION between two users
// ========================================
// ─────────────────────────────────────────────────────
// GET /api/messages/conversation/:otherEmail
// ─────────────────────────────────────────────────────
exports.getConversation = async (req, res) => {
  try {
    const { otherEmail } = req.params;
    const myId = req.user._id;

    // Find the other user
    const otherUser = await User.findOne({ email: otherEmail });

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Fetch all messages between these two users (both directions)
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUser._id },
        { sender: otherUser._id, receiver: myId }
      ]
    })
      .sort({ createdAt: 1 }) // oldest first
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.json({ messages });

  } catch (error) {
    console.error("GetConversation Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ========================================
// MARK MESSAGES AS READ
// ========================================

// ─────────────────────────────────────────────────────
// PATCH /api/messages/mark-read
// ─────────────────────────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const { senderEmail } = req.body;
    const myId = req.user._id;

    const sender = await User.findOne({ email: senderEmail });
    if (!sender) return res.status(404).json({ message: "Sender not found" });

    await Message.updateMany(
      { sender: sender._id, receiver: myId, isRead: false },
      { isRead: true }
    );

    res.json({ message: "Messages marked as read" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ─────────────────────────────────────────────────────
// DELETE /api/messages/:messageId
// Only the original sender can delete their message
// ─────────────────────────────────────────────────────
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Authorization check — only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await message.deleteOne();

    res.json({ message: "Message deleted" });

  } catch (err) {
    console.error("deleteMessage:", err.message);
    res.status(500).json({ message: err.message });
  }
};