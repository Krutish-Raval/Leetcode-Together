import { Comment } from "../models/comment.model.js";
import { ContestSolution } from "../models/contestSolution.model.js";
import { SolutionPost } from "../models/solutionPost.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadCloudinary} from "../utils/cloudinary.js"

const postSolution = asyncHandler(async (req, res, next) => {
  const {
    contestType,
    contestId,
    questionNo,
    hint,
    approach,
    implementation,
    anyLink,
    title,
  } = req.body;
  
  // console.log(req.body);
  // console.log(approach.length);
  if (
    contestType.trim() === "" ||
    (contestType !== "weekly" && contestType !== "biweekly") ||
    questionNo === 0 ||
    contestId.trim() === ""
  ) {
    throw new ApiError(400, "enter all fields");
  }
  if (
    title.trim() === "" ||
    hint.length === 0 ||
    approach.length === 0 ||
    implementation.length === 0 ||
    codeSS.length === 0
  ) {
    throw new ApiError(400,{}, "enter all fields");
  }

  if (!req.files || !req.files.codeSS || req.files.codeSS.length === 0) {
    throw new ApiError(400, "Please upload at least one screenshot of your code");
  }
  const uploadPromises = req.files.codeSS.map(file => uploadCloudinary(file.path));
  const  codeSSUrls = await Promise.all(uploadPromises);
   
  if (!codeSSUrls || codeSSUrls.length === 0) {
    throw new ApiError(500, {},"Failed to upload screenshots to Cloudinary");
  }


  let contestSolution = await ContestSolution.findOne({
    contestType,
    contestId,
    questionNo,
  });
  if (contestSolution) {
    let existSolutionByUser = await SolutionPost.findOne({
      postedBy: req.user._id,
    });
    if (existSolutionByUser) {
      throw new ApiError(400,"Already Posted Solution Edit if You Want");
    }
  }

  const newSolution = await SolutionPost.create({
    postedBy: req.user._id,
    title: title,
    hint: hint,
    approach: approach,
    implementation: implementation,
    codeSS: codeSSUrls,
    anyLink: anyLink,
  });

  if (!contestSolution) {
    contestSolution = await ContestSolution.create({
      contestType,
      contestId,
      questionNo,
      solutions: [newSolution],
    });
  } else {
    contestSolution.solutions.push(newSolution);
    await contestSolution.save({ validateBeforeSave: false });
  }
  const user = req.user;
  user.solutionPosted.push(newSolution);
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, newSolution, "Solution posted successfully"));
});

const getSolutionPosts = asyncHandler(async (req, res, next) => {
  const { contestType, contestId, questionNo } = req.body;

  if (
    (contestType.trim() !== "weekly" && contestType.trim() !== "biweekly") ||
    contestType === "" ||
    questionNo === 0 ||
    contestId.trim() === ""
  ) {
    console.log(contestId, contestType, questionNo);
    throw new ApiError(400, "enter all fields");
  }
  const contestSolution = await ContestSolution.findOne({
    contestType,
    contestId,
    questionNo,
  }).populate({
    path: "solutions",
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
  return res
    .status(200)
    .json(
      new ApiResponse(200, contestSolution, "Solution posted successfully")
    );
});

const deleteSolutionPost = asyncHandler(async (req, res, next) => {
  const { solutionId } = req.body;
  const userId = req.user._id;
  const solution = await SolutionPost.findById(solutionId);
  if (!solution) {
    throw new ApiError(404, "Solution not found");
  }
  if (solution.postedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this solution");
  }
  await Comment.deleteMany({ commentOnPost: solutionId });
  await ContestSolution.updateMany(
    { solutions: solutionId },
    { $pull: { solutions: solutionId } }
  );
  await User.updateOne(
    { _id: userId },
    { $pull: { solutionPosted: solutionId } }
  );
  await SolutionPost.findByIdAndDelete(solutionId);
  return res
    .status(200)
    .json(new ApiResponse(200,{}, "Solution deleted successfully"));
});

const editSolution = asyncHandler(async (req, res, next) => {
  const {
    contestType,
    contestId,
    questionNo,
    hint,
    approach,
    implementation,
    anyLink,
    title,
    solutionId,
    deleteSSIndices 
  } = req.body;
  // console.log(req.body);
  // console.log(approach.length);
  if (
    contestType.trim() === "" ||
    (contestType !== "weekly" && contestType !== "biweekly") ||
    questionNo === 0 ||
    contestId.trim() === ""
  ) {
    throw new ApiError(400, "enter all fields");
  }
  if (
    title.trim() === "" ||
    hint.length === 0 ||
    approach.length === 0 ||
    implementation.length === 0
  ) {
    throw new ApiError(400, "enter all fields");
  }

  let contestSolution = await ContestSolution.findOne({
    contestType,
    contestId,
    questionNo,
  });

  const solution = await SolutionPost.findById(solutionId);
  if (!solution) {
    throw new ApiError(404, "Solution not found");
  }

  if (solution.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this solution");
  }

  if (deleteSSIndexes?.length) {
    solution.codeSS = solution.codeSS.filter((_, index) => !deleteSSIndexes.includes(index));
  }

  if (req.files?.codeSS?.length) {
    const uploadPromises = req.files.codeSS.map(file => uploadCloudinary(file.path));
    const newUrls = await Promise.all(uploadPromises);
    solution.codeSS.push(...newUrls);
  }

  const newSolution = await SolutionPost.findByIdAndUpdate(
    solutionId,
    {
      $set: {
        title: title,
        hint: hint,
        approach: approach,
        implementation: implementation,
        codeSS: codeSS,
        anyLink: anyLink,
      },
    },
    {
      new: true,
    }
  );

  const solutionIndex = contestSolution.solutions.findIndex(
    (s) => s.toString() === solutionId
  );

  if (solutionIndex === -1) {
    throw new ApiError(404, "Solution not found in Contest Solution");
  }

  contestSolution.solutions[solutionIndex] = solution._id;
  await contestSolution.save({ validateBeforeSave: false });

  const user = await User.findById(req.user._id);

  const userSolutionIndex = user.solutionPosted.findIndex(
    (s) => s.toString() === solutionId
  );
  if (userSolutionIndex === -1) {
    throw new ApiError(404, "Solution not found in User's Posted Solutions");
  }

  user.solutionPosted[userSolutionIndex] = solution._id;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, newSolution, "Solution posted successfully"));
});
export { deleteSolutionPost, getSolutionPosts, postSolution,editSolution };
