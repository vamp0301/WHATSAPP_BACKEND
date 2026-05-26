const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
 
  name:{
    type:String,
    required:[true,"Need a Name of the user to create an account"],
    trim:true,
    default:""
  },   email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email address"
      }
    },
      /*
      Password field
      - Required only if user signs up normally
      - Not required for Google OAuth users
    */
    password: {
     type: String,
      minlength: 6,
      select:false,
      default:null// null for OAuth users
},
    /*
      Google OAuth ID
      Present only if user logs in via Google
    */
    googleId: {
      type: String,
    },
 /*
      OTP login fields
      Stored temporarily during OTP login
    */
    otp: {
      type: String,
      default:null
    },

    otpExpiry: {
      type: Date
    },
  /*
      Check if email verified
      Useful for OTP verification
    */
    isVerified: {
      type: Boolean,
      default: false
    },  /*
      Auth provider type
      local | google
    */
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
     // For real-time messaging: track socket id
    socketId: {
      type: String,
      default: null
    }
  },

 { timestamps: true });

/*
 Hash password before saving
*/
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/*
  Compare password method
*/
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel=mongoose.model("user",userSchema);
module.exports = userModel;