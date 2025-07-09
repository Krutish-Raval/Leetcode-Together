  import { User } from "../models/user.model.js";
  import { ApiError } from "../utils/ApiError.js";
  import { ApiResponse } from "../utils/ApiResponse.js";
  import { asyncHandler } from "../utils/asyncHandler.js";;

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
  const { name, leetcodeId ,email} = req.body;
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
  // console.log(req.user)
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully"));
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

const fetchAllFriends=asyncHandler(async(req,res,next)=>{
  const user = await User.findById(req.user._id);
  const friends = user.friends
  return res
    .status(200)
    .json(new ApiResponse(200, { friends }, "Friends list fetched successfully"));
})

//Need to change this
const updateFriendProfile = asyncHandler(async (req, res, next) => {
  const {beforeleetcodeId, leetcodeId, friendName } = req.body;
   console.log(req.body);
  if (!leetcodeId || !friendName) {
    throw new ApiError(400, "Leetcode Id and friendName is required");
  }
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      "friends.leetcodeId": beforeleetcodeId,
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
    .json(new ApiResponse(200, {friendName,leetcodeId}, "Friend profile updated successfully"));
});



const deleteAccount=asyncHandler(async(req,res)=>{

})
export {
  addFriend,
  addUserDetails,
  changeCurrentPassword,
  getCurrentUser,
  getFriendsList,
  removeFriend,
  updateFriendProfile,
  deleteAccount,
  fetchAllFriends
};
