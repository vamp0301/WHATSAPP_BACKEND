// src/config/passport.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

// =========================================
// GUARD: Check credentials exist first
// =========================================
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("❌ Google OAuth credentials missing in .env");
}

// =========================================
// GOOGLE OAUTH STRATEGY
// =========================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
"http://localhost:3020/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          // If user exists via local but now logging in with Google
          if (user.provider === "local") {
            user.provider = "google";
            user.googleId = googleId;
            user.isVerified = true;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user from Google
        user = await User.create({
          name,
          email,
          googleId,
          provider: "google",
          isVerified: true // Google already verified the email
        });

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// =========================================
// SERIALIZE USER (save user id to session)
// ✅ FIXED: Was missing entirely before
// =========================================
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// =========================================
// DESERIALIZE USER (read user from session)
// ✅ FIXED: Was missing entirely before
// =========================================
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;