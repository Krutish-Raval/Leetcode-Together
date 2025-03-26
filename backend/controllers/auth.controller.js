import crypto from "crypto";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/emailService.js";

const sendVerificationOTP = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  await sendEmail(
    user.email,
    "Email Verification OTP",
    `Your OTP for email verification is: ${otp}`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully to your email"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user._id);

  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.otp || user.otpExpires < Date.now()) {
    throw new ApiError(400, "OTP expired or invalid. Please request again.");
  }

  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

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
    verifyEmail,
    sendPasswordResetOTP,
    resetPassword
}