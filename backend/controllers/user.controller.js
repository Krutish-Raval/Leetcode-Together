import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";;
import {SolutionPost} from "../models/solutionPost.model.js"

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

  return res
    .status(200)
    .json(new ApiResponse(200, {
      friendName,
      leetcodeId,
    }, "Friend added successfully"));
});

const removeFriend = asyncHandler(async (req, res, next) => {
  // get leetcodeId
  // check if this leetcodeId exists
  // check if this leetcodeId is already in friends array
  // if not throw error
  // remove from friends array
  const { leetcodeId } = req.query;

  // console.log(leetcodeId);
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
  const { page = 1, limit = 10 } = req.query;
  
  const user = await User.findById(req.user._id);
  // console.log(user);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const totalFriends = user.friends.length;
  const friends = user.friends.reverse().slice((page - 1) * limit, page * limit);
  // console.log(friends,page)
  return res
    .status(200)
    .json(new ApiResponse(200, { friends, totalFriends, page }, "Friends list fetched successfully"));
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

const uploadedSolution = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("solutionPosted")
    .populate({
      path: "solutionPosted",
      populate: [
        {
          path: "postedBy",
          select: "name email _id",
        },
        {
          path: "comments",
          select: "commentText commentBy",
          populate: {
            path: "commentBy",
            select: "name _id",
          },
        },
      ],
    });
    return res.status(200).json(new ApiResponse(200,user,"uploaded solution by user"));
});

const saveSolutionPost= asyncHandler(async(req,res) =>{
  const {solutionId}=req.body;
  if (!solutionId) {
    throw new ApiError(400, "Solution ID is required.");
  } 
  const solution = await SolutionPost.findById(solutionId);
  if (!solution) {
    throw new ApiError(404, "Solution not found.");
  }
  const user = await User.findById(req.user._id);
  if (user.saved.includes(solutionId)) {
    throw new ApiError(400, "Solution already saved.");
  }

  user.saved.push(solutionId);
  await user.save();
  res
    .status(200)
    .json(new ApiResponse(200, user.saved, "Solution saved successfully."));
})

const getSaveSolutionPost=asyncHandler(async(req,res)=>{
  const user=await User.findOne.findById(req.user._id).populate({
    path:"saved",
    populate: [
      {
        path: "postedBy",
        select: "name email _id",
      },
      {
        path: "comments",
        select: "commentText commentBy",
        populate: {
          path: "commentBy",
          select: "name _id",
        },
      },
    ],
  });
})

export {
  addFriend,
  addUserDetails,
  changeCurrentPassword,
  getCurrentUser,
  getFriendsList,
  removeFriend,
  updateFriendProfile,
  updateUserDetails,
  uploadedSolution,
  saveSolutionPost,
  getSaveSolutionPost
};
