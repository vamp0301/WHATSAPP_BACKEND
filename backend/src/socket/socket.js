const Message = require("../models/message.model");
const User = require("../models/user.model");

/*
 =====================================
        ONLINE USERS MAP
 =====================================
*/
const onlineUsers = {};

/*
 =====================================
        SOCKET HANDLER
 =====================================
*/
const socketHandler = (io) => {

  io.on("connection", async (socket) => {

    /*
 =====================================
          USER CONNECTED
 =====================================
*/
    const userId = socket.id;

    console.log("User Connected:", userId);

    /*
 =====================================
        SAVE ONLINE USER
 =====================================
*/
    onlineUsers[userId] = socket.id;

    console.log("Online Users:", onlineUsers);

    /*
 =====================================
        BROADCAST USERS
 =====================================
*/
    io.emit(
      "getOnlineUsers",
      Object.keys(onlineUsers)
    );

    /*
 =====================================
          SEND MESSAGE
 =====================================
*/
    socket.on("sendMessage", async (data) => {

      try {

        const {
          receiverId,
          message
        } = data;

        /*
 =====================================
          SAVE MESSAGE in mongoodb
 =====================================
*/
        const newMessage = await Message.create({

  sender: "6834e2f11111111111111111",

  receiver: "6834e2f22222222222222222",

  message,

  status: "sent",

});

        console.log(
          "New Message:",
          newMessage
        );

        /*
 =====================================
      SEND BACK TO SAME USER
 =====================================
*/
        socket.emit(
          "receiveMessage",
          newMessage
        );

      } catch (error) {

        console.log(
          "Send Message Error:",
          error.message
        );
      }
    });

    /*
 =====================================
          TYPING EVENT
 =====================================
*/
    socket.on("typing", () => {

      socket.broadcast.emit(
        "typing",
        {
          senderId: userId
        }
      );
    });

    /*
 =====================================
        STOP TYPING EVENT
 =====================================
*/
    socket.on("stopTyping", () => {

      socket.broadcast.emit(
        "stopTyping",
        {
          senderId: userId
        }
      );
    });

    /*
 =====================================
          MESSAGE SEEN
 =====================================
*/
    socket.on("messageSeen", (messageId) => {

      console.log(
        "Message Seen:",
        messageId
      );

      socket.emit(
        "messageSeen",
        {
          messageId,
          status: "seen"
        }
      );
    });

    /*
 =====================================
        USER DISCONNECT
 =====================================
*/
    socket.on("disconnect", () => {

      console.log(
        "User Disconnected:",
        userId
      );

      /*
        REMOVE USER
      */
      delete onlineUsers[userId];

      /*
        UPDATE ONLINE USERS
      */
      io.emit(
        "getOnlineUsers",
        Object.keys(onlineUsers)
      );

      console.log(
        "Online Users:",
        onlineUsers
      );
    });

  });

};

module.exports = socketHandler;