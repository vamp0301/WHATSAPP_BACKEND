const Message = require("../models/message.model");
const User = require("../models/user.model");

// ========================================
// SEND MESSAGE
// POST /api/messages/send
// ========================================
exports.sendMessage = async (req, res) => {
  try {

    const { receiverEmail, message } = req.body;

    const senderId = req.user._id;

    // ================================
    // VALIDATION
    // ================================
    if (!receiverEmail || !message) {
      return res.status(400).json({
        message: "receiverEmail and message required"
      });
    }

    // ================================
    // FIND RECEIVER
    // ================================
    const receiver = await User.findOne({
      email: receiverEmail
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found"
      });
    }

    // ================================
    // PREVENT SELF MESSAGE
    // ================================
    if (
      receiver._id.toString() ===
      senderId.toString()
    ) {
      return res.status(400).json({
        message: "Cannot send message to yourself"
      });
    }

    // ================================
    // SAVE MESSAGE TO DATABASE
    // IMPORTANT:
    // schema field name is "message"
    // NOT "content"
    // ================================
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiver._id,
      message: message,
      isSeen: false,
      status: "sent"
    });

    // ================================
    // RESPONSE
    // ================================
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });

  } catch (error) {

    console.error(
      "SendMessage Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========================================
// GET CONVERSATION
// GET /api/messages/conversation/:otherEmail
// ========================================
exports.getConversation = async (req, res) => {
  try {

    const { otherEmail } = req.params;

    const myId = req.user._id;

    // ================================
    // FIND OTHER USER
    // ================================
    const otherUser = await User.findOne({
      email: otherEmail
    });

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ================================
    // GET ALL CHAT MESSAGES
    // ================================
    const messages = await Message.find({
      $or: [
        {
          sender: myId,
          receiver: otherUser._id
        },
        {
          sender: otherUser._id,
          receiver: myId
        }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar");

    res.json({
      success: true,
      messages
    });

  } catch (error) {

    console.error(
      "GetConversation Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========================================
// MARK AS READ
// PATCH /api/messages/mark-read
// ========================================
exports.markAsRead = async (req, res) => {
  try {

    const { senderEmail } = req.body;

    const myId = req.user._id;

    // ================================
    // FIND SENDER
    // ================================
    const sender = await User.findOne({
      email: senderEmail
    });

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found"
      });
    }

    // ================================
    // UPDATE MESSAGES
    // ================================
    await Message.updateMany(
      {
        sender: sender._id,
        receiver: myId,
        isSeen: false
      },
      {
        isSeen: true
      }
    );

    res.json({
      success: true,
      message: "Messages marked as read"
    });

  } catch (error) {

    console.error(
      "MarkAsRead Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========================================
// DELETE MESSAGE
// DELETE /api/messages/:messageId
// ========================================
exports.deleteMessage = async (req, res) => {
  try {

    const message = await Message.findById(
      req.params.messageId
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    // ================================
    // ONLY SENDER CAN DELETE
    // ================================
    if (
      message.sender.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own messages"
      });
    }

    // ================================
    // DELETE MESSAGE
    // ================================
    await message.deleteOne();

    res.json({
      success: true,
      message: "Message deleted successfully"
    });

  } catch (error) {

    console.error(
      "DeleteMessage Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};