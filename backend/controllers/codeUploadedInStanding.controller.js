import { CodeUpload } from "../models/codeUploaded.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadSolution = asyncHandler(async (req, res) => {
  const {question,contestName,userLeetcodeId,solution}=req.body;
  // console.log(question,contestName,userLeetcodeId,);
  if (!question || !contestName || !solution) {
    throw new ApiError(400, "All fields are required.");
  }
  const existingSolution = await CodeUpload.findOne({
    uploadedBy: userLeetcodeId,
    contestName,
    questionNo:question,
    code: solution
  });
  //  console.log(question,contestName,userLeetcodeId,);
  if (existingSolution) {
    throw new ApiError(
      400,
      "You have already uploaded a solution for this contest question."
    );
  }
  
  const newUpload = await CodeUpload.create({
    uploadedBy: userLeetcodeId.trim(),
    contestName: contestName.trim(),
    questionNo: question.trim(),
    code: solution
  });
  console.log(newUpload);
  res
    .status(200)
    .json(new ApiResponse(200, newUpload, "Solution uploaded successfully"));
});

const getSolution = asyncHandler(async (req, res) => {
  //console.log(req.body);
  const {contestName, q, userLeetcodeId} = req.query;
  // console.log("GetSolution Query: ",req.query);
  //console.log(contestName, q, userLeetcodeId);
  const existingSolution = await CodeUpload.findOne({
    uploadedBy: userLeetcodeId.trim(),
    questionNo:q.trim(),
    contestName:contestName.trim(),
  });
  
  return res
    .status(200)
    .json(new ApiResponse(200, existingSolution, "solution fetched"));
});

const deleteSolution = asyncHandler(async (req, res) => {
  const { contestName,userLeetcodeId,question } = req.body;
  const solution = await CodeUpload.findOne({
    uploadedBy:userLeetcodeId,
    contestName,
    questionNo:question,
  });
  await CodeUpload.findByIdAndDelete(solution._id);
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Solution deleted successfully"));
});

const editSolution = asyncHandler(async (req, res) => {
  const { userLeetcodeId, solution:code,question,contestName } = req.body;
  // console.log(req.body);
  const solution = await CodeUpload.findOne({uploadedBy: userLeetcodeId,contestName, questionNo:question});
  // console.log(solution);
  solution.code = code;
  await solution.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {code}, "Solution edited successfully"));
});

export { deleteSolution, editSolution, getSolution, uploadSolution };
