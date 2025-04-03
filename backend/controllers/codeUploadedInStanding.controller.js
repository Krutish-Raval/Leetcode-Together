import { CodeUpload } from "../models/codeUploaded.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadSolution = asyncHandler(async (req, res) => {
  const {questionNo,contestName,leetcodeId,code}=req.body;
  if (!questionNo || !contestName || !code) {
    throw new ApiError(400, "All fields are required.");
  }
  const existingSolution = await CodeUpload.findOne({
    uploadedBy: leetcodeId,
    contestName,
    questionNo,
  });

  if (existingSolution) {
    throw new ApiError(
      400,
      "You have already uploaded a solution for this contest question."
    );
  }

  const newUpload = await CodeUpload.create({
    uploadedBy: leetcodeId,
    contestId: contestId,
    questionNo: questionNo,
    contestType: contestType,
    code: code,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newUpload, "Solution uploaded successfully"));
});

const getSolution = asyncHandler(async (req, res) => {
  const {  questionNo, contestName, id } = req.body;
  const existingSolution = await CodeUpload.findOne({
    uploadedBy: id,
    questionNo,
    contestName
  });
  if (!existingSolution) {
    throw new ApiError(400, "could not find solution");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, existingSolution, "solution fetched"));
});

const deleteSolution = asyncHandler(async (req, res) => {
  const { leetcodeId } = req.body;
  const solution = await CodeUpload.findOne({leetcodeId});
  if (!solution) {
    throw new ApiError(404, "Solution not found.");
  }

  if (solution.uploadedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this solution.");
  }

  await CodeUpload.findByIdAndDelete(solutionId);
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Solution deleted successfully"));
});

const editSolution = asyncHandler(async (req, res) => {
  const { leetcodeId, code } = req.body;
  const solution = await CodeUpload.findOne({uploadedBy: leetcodeId})
  if (!solution) {
    throw new ApiError(404, "Solution not found.");
  }

  if (solution.uploadedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this solution.");
  }
  solution.code = code;
  await solution.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Solution edited successfully"));
});

export { deleteSolution, editSolution, getSolution, uploadSolution };
