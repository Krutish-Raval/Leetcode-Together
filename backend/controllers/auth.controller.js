import crypto from "crypto";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/emailService.js";
import { OTP } from "../models/OTP.model.js";
import validator from "validator";

const sendVerificationOTP = asyncHandler(async (req, res, next) => {
  const {email}=req.body
  const otp = crypto.randomInt(100000, 999999).toString();
  const user=await User.findOne({email});
  if(user){
    throw new ApiError(400,"User already exists")
  }
  if(!validator.isEmail(email)){
    throw new ApiError(400,"write correct email format")
  }
  OTP.create({
    email:email,
    otp:otp
  })

  await sendEmail(
    email,
    "Email Verification OTP",
    `Your OTP for email verification is: ${otp}`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully to your email"));
});

const resendOtp=asyncHandler(async(req,res,next)=>{
  const {email}=req.body
  const otp = crypto.randomInt(100000, 999999).toString();
  OTP.create({
    email:email,
    otp:otp
  })

  await sendEmail(
    user.email,
    "Email Verification OTP",
    `Your OTP for email verification is: ${otp}`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully to your email"));
})

const sendPasswordResetOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;       
    await user.save({ validateBeforeSave: false });
  
    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${otp}`
    );
  
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset OTP sent to your email"));
  });

const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      throw new ApiError(400, "Email, OTP, and New Password are required");
    } 
  
    const user = await User.findOne({ email });
  
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      throw new ApiError(400, "Invalid OTP or OTP expired");
    }
  
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
  
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully"));
  });
  
export{
    sendVerificationOTP,
    sendPasswordResetOTP,
    resetPassword,
    resendOtp
}