import { Comment } from "../models/comment.model.js";
import { ContestSolution } from "../models/contestSolution.model.js";
import { SolutionPost } from "../models/solutionPost.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const postSolution = asyncHandler(async (req, res, next) => {
  const { contestType,contestId,questionNo,hint,approach,implementation,codeSS,anyLink,title} = req.body;
  // console.log(req.body);
  // console.log(approach.length);
  if ( contestType.trim() === "" || (contestType !== "weekly" && contestType !== "biweekly") || questionNo === 0 || contestId.trim() === "") {
    throw new ApiError(400, "enter all fields");
  }
  if (
    title.trim() === "" ||
    hint.length === 0 ||
    approach.length === 0 ||
    implementation.length === 0 ||
    codeSS.length === 0
  ) {
    
    throw new ApiError(400, "enter all fields");
  }
  const newSolution = await SolutionPost.create({
    postedBy: req.user._id,
    title:title,
    hint:hint,
    approach:approach,
    implementation:implementation,
    codeSS: codeSS,
    anyLink:anyLink,
  });

  let contestSolution = await ContestSolution.findOne({
    contestType,
    contestId,
    questionNo,
  });

  if (!contestSolution) {
    contestSolution = await ContestSolution.create({
      contestType,
      contestId,
      questionNo,
      solutions: [newSolution],
    });
  } 
  else {
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
    contestType.trim() === "" ||
    contestType !== "weekly" ||
    contestType !== "biweekly" ||
    questionNo != 0 ||
    contestId.trim() === ""
  ) {
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
      },
      {
        path: "comments",
        select: "commentText commentBy",
        populate: {
          path: "commentBy",
          select: "name",
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
  const solutionId = req.params;
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
  return ApiResponse(200, "Solution deleted successfully");
});

export {deleteSolutionPost, getSolutionPosts, postSolution};
