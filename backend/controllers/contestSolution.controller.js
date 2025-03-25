import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const postContestSolution = asyncHandler(async (req, res) => {
  const { contestId } = req.params;
  const {
    title,
    problemId,
    hint,
    approach,
    implementation,
    code,
    codeSS,
    anyLink,
  } = req.body;
  if ([title, problemId].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title and ProblemId are required");
  }
  if (
    implementation[0].trim() === "" ||
    code[0].trim() === "" ||
    codeSS[0].trim() === ""
  ) {
    throw new ApiError(400, "Implementation, code and codeSS are required");
  }
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  let contest = await contestSolution.findOne({ constestId: contestId });


  const newSolution = {
    title,
    problemId,
    postedBy: userId,
    hint: hint,
    approach: approach,
    implementation: implementation,
    user: req.user,
    codeSchema: code,
    codeScreenshot: codeSS,
    anyLink,
    isPublished: true, 
  };

  const updatedContest = await contestSolution.findOneAndUpdate(
    { constestId: contestId },
    {
      $addToSet: { solutionPost: newSolution },
    },
    { upsert: true, new: true }
  );
  

  await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { solutionPosted: newSolution._id },
    },
    { new: true }
  );
  
  await contest.save();

  // Update user's solutionPosted field
  user.solutionPosted = newSolution._id;
  await user.save();

  res
    .status(201)
    .json(new ApiResponse(201, updatedContest,"Solution posted successfully", newSolution));
});
