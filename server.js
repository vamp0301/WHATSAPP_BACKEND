/*
  Load environment variables FIRST
  dotenv reads .env file and loads variables into process.env
*/
require("dotenv").config();
// Import required core modules
const http = require("http");
const { Server } = require("socket.io");
// Import custom files
const app = require("./src/app");
const connectDB = require("./src/config/db");
/*
 =============================
   CONNECT TO DATABASE
 =============================
*/
connectDB();

/*
  Create HTTP server using express app
  Needed because socket.io works with HTTP server
*/
const server = http.createServer(app);


/*
 =============================
      SOCKET.IO SETUP
 =============================
*/
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});


/*
  When a user connects via WebSocket
*/
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  /*
    Listen for message from client
  */
  socket.on("sendMessage", (data) => {
    console.log("Message Received:", data);

    // Broadcast message to all connected users
    io.emit("receiveMessage", data);
  });

  /*
    When user disconnects
  */
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

/*
 =============================
      START SERVER
 =============================
*/

// Get PORT from .env
const PORT = process.env.PORT || 3000;

// Start listening
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});