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
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

/*
 =====================================
      HANDLE SOCKET EVENTS
 =====================================
*/
socketHandler(io);

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