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
    contestName,
    question,
    hint,
    approach,
    implementation,
    anyLink,
    title,
  } = req.body;
  
  console.log(req.body);
  // console.log(approach.length);


  let contestSolution = await ContestSolution.findOne({
    contestName,
    questionNo:question,
  });
  // if (contestSolution) {
  //   let existSolutionByUser = await SolutionPost.findOne({
  //     postedBy: req.user._id,
  //   });
  //   if (existSolutionByUser) {
  //     throw new ApiError(400,"Already Posted Solution Edit if You Want");
  //   }
  // }

  const newSolution = await SolutionPost.create({
    postedBy: req.user._id,
    title: title,
    hint: hint,
    approach: approach,
    implementation: implementation,
    // codeSS: codeSSUrls,
    anyLink: anyLink,
  });
  console.log(newSolution)
  console.log(contestSolution);
  if (!contestSolution) {
    contestSolution = await ContestSolution.create({
      contestName:contestName,
      questionNo:question,
      solutions: [newSolution._id],
    });
    // console.log(contestSolution);
  } else {
    contestSolution.solutions.push(newSolution._id);
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
  const { contestName, questionNo, page = 1, limit = 12 } = req.query;

  const contestSolution = await ContestSolution.findOne({
    contestName,
    questionNo,
  }).populate({
    path: "solutions",
    options: {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { createdAt: -1 }, 
    },
    populate: [
      {
        path: "postedBy",
        select: "name email _id",
      },
      // {
      //   path: "comments",
      //   select: "commentText commentBy",
      //   populate: {
      //     path: "commentBy",
      //     select: "name _id",
      //   },
      // },
    ],
  });

  if (!contestSolution) {
    return res.status(200).json(new ApiResponse(200, {posts:[],totalPages:0}, "No such contest solution found"));
  }

  // Get total number of solutions for pagination
  const totalSolutions = await ContestSolution.aggregate([
    { $match: { contestName, questionNo } },
    {
      $project: {
        totalSolutions: { $size: "$solutions" },
      },
    },
  ]);

  const total = totalSolutions[0]?.totalSolutions || 0;
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      posts: contestSolution.solutions,
      totalPages,
    }, "Solution posts fetched successfully")
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
