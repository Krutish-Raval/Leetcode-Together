import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email:{
    type: String,
    required: [true, "Email is required"]
  },
  otp: {
    type: String,
    required: [true, "OTP is required"],
  },
  otpExpires: {
    type: Date,
  },
});

export const OTP = mongoose.model("OTP", OTPSchema);