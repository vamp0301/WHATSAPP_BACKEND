/*express setup only */
//IMPORT REQUIRED PACKAGES
const express = require("express");
const cors = require("cors");//connect backend to frontend to talk to each other
const cookieParser =  require("cookie-parser");//sent cookies sent by browser
const session = require("express-session");
const passport = require("./config/passport");
/*
  Import Custom Files
*/
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const userRoutes    = require("./routes/user.routes");
// Important: This loads passport strategy configuration
// Create express application instance
const app = express();

/*
 =============================
        MIDDLEWARE
 =============================
*/
/*
  Enable CORS
  Allows frontend (React) to communicate with backend
  credentials: true allows cookies to be sent
*/
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// Middleware to parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to parse cookies
app.use(cookieParser());

/*
  Session middleware (Required for OAuth)
  Used temporarily during Google authentication flow
*/
app.use(
  session({
    secret: process.env.JWT_SECRET, // Better to keep separate in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000 // 10 mins — only used during OAuth flow
    }
  })
);

/*
  Initialize Passport
*/
app.use(passport.initialize());

/*
  Enable persistent login sessions
*/
app.use(passport.session());
/*
 ==================================================
                ROUTES SECTION
 ==================================================
*/

// All authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users",    userRoutes);
/*
  Test Route
*/
app.get("/", (req, res) => {
  res.json({
    status:    "ok",
    message:   "WhatsApp Clone API 🚀",
    endpoints: {
      auth:     "/api/auth",
      messages: "/api/messages",
      users:    "/api/users"
    }})
});

/*
 ==================================================
                GLOBAL ERROR HANDLER
 ==================================================
  Catches unhandled errors in controllers
*/
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});


/*
  Export app so server.js can use it
*/
module.exports = app;