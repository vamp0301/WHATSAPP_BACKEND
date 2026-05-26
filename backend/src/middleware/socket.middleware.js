const jwt = require("jsonwebtoken");

/*
 =====================================
      SOCKET AUTH MIDDLEWARE
 =====================================
*/
const socketAuth = (socket, next) => {

  try {

    /*
      Get token from handshake auth
    */
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    /*
      Verify token
    */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
      Attach user data to socket
    */
    socket.user = decoded;

    next();

  } catch (error) {

    next(new Error("Invalid Token"));
  }
};

module.exports = socketAuth;