import crypto from "crypto";
import validator from "validator";
import { OTP } from "../models/OTP.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/emailService.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  // get user details
  // validation email in correct format and all required non empty
  // check if user already exists email,leetcodeId
  // create user object - create entry db
  // remove password and refresh token from response
  // check for user creation

  const { email, password, confirmPassword, otp } = req.body;
  // console.log("Body: ",req.body);

  if (
    [email, password, confirmPassword].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({ email });

  const latestOtp = await OTP.findOne({ email })
    .sort({ createdAt: -1 })
    .limit(1);
  // console.log(latestOtp);
  if (!latestOtp || latestOtp.otp !== otp) {
    throw new ApiError(401, "Invalid or expired OTP");
  }
  if (existedUser) {
    throw new ApiError(402, "User already exists");
  }

  const user = await User.create({
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // console.log("createdUser: ", createdUser);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully", createdUser));
  // res.status(200).json({
  //     success: true,
  //     message: "ok"
  // })
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordCorrect = await user.verifyPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("AccessToken", accessToken, cookieOptions)
    .cookie("RefreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res, next) => {
  // clear cookies
  // console.log(req.user._id);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        RefreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies?.RefreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh Token is invalid");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (err) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const sendVerificationOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(400, "User already exists");
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "write correct email format");
  }
  OTP.create({
    email: email,
    otp: otp,
  });

  await sendEmail(
    email,
    "Email Verification OTP",
    `Your OTP for email verification is: ${otp}`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully to your email"));
});

const resendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
  OTP.create({
    email: email,
    otp: otp,
  });

  await sendEmail(
    user.email,
    "Email Verification OTP",
    `Your OTP for email verification is: ${otp}`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully to your email"));
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

  res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  resendOtp,
  resetPassword,
  sendPasswordResetOTP,
  sendVerificationOTP,
};
