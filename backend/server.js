/*
 =====================================
      LOAD ENV VARIABLES
 =====================================
*/
require("dotenv").config();

/*
 =====================================
        IMPORT MODULES
 =====================================
*/
const http = require("http");

const { Server } = require("socket.io");

/*
 =====================================
        IMPORT CUSTOM FILES
 =====================================
*/
const app = require("./src/app");

const connectDB = require("./src/config/db");

const socketHandler = require("./src/socket/socket");

const socketAuth = require(
  "./src/middleware/socket.middleware"
);

/*
 =====================================
        CONNECT DATABASE
 =====================================
*/
connectDB();

/*
 =====================================
      CREATE HTTP SERVER
 =====================================
*/
const server = http.createServer(app);

/*
 =====================================
        SOCKET.IO SETUP
 =====================================
*/
const io = new Server(server, {

  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }

});

/*
 =====================================
      HANDLE SOCKET EVENTS
 =====================================
*/
socketHandler(io);
io.on("connection", (socket) => {
socket.on("send_message", (messageData) => {

  io.emit("receive_message", messageData);

});
  console.log(

    "SOCKET CONNECTED:",

    socket.id

  );

});

/*
 =====================================
        START SERVER
 =====================================
*/
const PORT = process.env.PORT || 3020;

server.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );
});