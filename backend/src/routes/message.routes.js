const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const protect = require("../middleware/auth.middleware");

// All message routes require authentication
router.use(protect);

// Send a message (also triggers socket in server.js)
router.post("/send", messageController.sendMessage);

// Get full conversation with another user by their email
router.get("/conversation/:otherEmail", messageController.getConversation);

// Mark messages as read
router.patch("/mark-read", messageController.markAsRead);
// DELETE /api/messages/:messageId                → delete one message
router.delete("/:messageId",messageController.deleteMessage);
module.exports = router;