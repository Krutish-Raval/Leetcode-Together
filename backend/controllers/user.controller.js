import validator from "validator";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

  const { email, password,confirmPassword, OTP } = req.body;

  if ([email, password,confirmPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  } 
  else if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid Email format");
  }
  else if(password !== confirmPassword){
    throw new ApiError(400, "Passwords do not match");
  }
  const existedUser = await User.findOne({ email });
  
  // console.log("existedUser: ", existedUser);
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
  // take email and password
  // check if user exists
  // check if password or email is correct
  // generate access token and refresh token
  // send cookies

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
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
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

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!(currentPassword && newPassword && confirmPassword)) {
    throw new ApiError(
      400,
      "Current password ,new password and confirm password are required"
    );
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(401, "Passwords do not match");
  }
  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.verifyPassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect current password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const addUserDetails = asyncHandler(async (req, res, next) => {
  const { name, leetcodeId } = req.body;
  if (!(name && leetcodeId)) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name: name,
        leetcodeId: leetcodeId,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
//   console.log("user: ", user);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details added successfully"));
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
  const { name, leetcodeId, email } = req.body;
  if (!(name && leetcodeId && email)) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name: name,
        leetcodeId: leetcodeId,
        email: email,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});

const addFriend = asyncHandler(async (req, res, next) => {
  // get leetcodeId
  // check if this leetcodeId exists
  // check if this leetcodeId is already in friends array
  // add to friends array
  const { leetcodeId, friendName } = req.body;
  if (!leetcodeId || !friendName) {
    throw new ApiError(400, "Leetcode Id and friendName is required");
  }

  const friendExists = await User.findOne({
    _id: req.user._id,
    $or: [
      { "friends.leetcodeId": leetcodeId },
      { "friends.friendName": friendName },
    ],
  });
  if (friendExists) {
    throw new ApiError(402, "Friend already exists in your friends list");
    }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        friends: {
          leetcodeId,
          friendName,
        },
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
 
  // Add the user to the friend's friendOf list
  const addedFriend = await User.findOne({ leetcodeId });

  if (addedFriend) {
    await User.findByIdAndUpdate(
      addedFriend._id,
      {
        $addToSet: {
          friendOf: {
            leetcodeId: req.user.leetcodeId,
            friendName: req.user.name,
          },
        },
      },
      { new: true }
    );
  } 

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Friend added successfully"));
});

const removeFriend = asyncHandler(async (req, res, next) => {
  // get leetcodeId
  // check if this leetcodeId exists
  // check if this leetcodeId is already in friends array
  // if not throw error
  // remove from friends array
  const { leetcodeId } = req.body;
  if (!leetcodeId) {
    throw new ApiError(400, "Leetcode Id is required");
  }
  const friend = await User.findOne({
    _id: req.user._id,
    "friends.leetcodeId": leetcodeId,
  });
  if (!friend) {
    throw new ApiError(401, "Not in Friends list");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        friends: {
          leetcodeId,
        },
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Friend removed successfully"));
});

const getFriendsList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("friends");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Friends list fetched successfully"));
});

//Need to change this
const updateFriendProfile = asyncHandler(async (req, res, next) => {
  const { leetcodeId, friendName } = req.body;
  if (!leetcodeId || !friendName) {
    throw new ApiError(400, "Leetcode Id and friendName is required");
  }
  const existingFriend = await User.findOne({
    _id: req.user._id,
    $or: [
      { "friends.leetcodeId": leetcodeId },
      { "friends.friendName": friendName },
    ],
  });

  if (existingFriend) {
    throw new ApiError(
      402,
      "LeetcodeId or friendName already exists in your friends list"
    );
  }
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $set: {
        "friends.$.leetcodeId": leetcodeId,
        "friends.$.friendName": friendName,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Friend profile updated successfully"));
});


export {
  addFriend,
  changeCurrentPassword,
  getCurrentUser,
  getFriendsList,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  removeFriend,
  updateFriendProfile,
  updateUserDetails,
  addUserDetails,
};
