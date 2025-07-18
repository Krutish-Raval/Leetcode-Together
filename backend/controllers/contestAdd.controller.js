import { Contest } from "../models/contest.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addContest = asyncHandler(async (req, res) => {
  const { contestType, contestId, date } = req.body;
  const newContest = new Contest({
    contestType,
    contestId,
    date: date || new Date(),
  });

  await newContest.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { contestType, contestId, date },
        "contest added successfully"
      )
    );
});

const removeContest = asyncHandler(async (req, res) => {
  const { contestId } = req.body;

  const deletedContest = await Contest.findOneAndDelete({ contestId });
  return res
    .status(200)
    .json(new ApiResponse(200, { contestId }, "contest removed successfully"));
});

const getAllContests = asyncHandler(async (req, res) => {
  let { page = 1, limit = 6 } = req.query;
  page = parseInt(page) || 1; 
  limit = parseInt(limit) || 6; 
  // console.log(page);
  const totalContests = await Contest.countDocuments();
  const contests = await Contest.find()
    .sort({ date: -1 }) // Latest first
    .skip((page - 1) * limit)
    .limit(limit);
  // console.log(contests);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalContests,
        totalPages: Math.ceil(totalContests / limit),
        currentPage: page,
        contests,
      },
      "Fetched contests"
    )
  );
});

const populateContests = asyncHandler(async (req, res) => {
  let contests = [];
  let weeklyContestId = 443;
  let biweeklyContestId = 153;
  let weeklyDate = new Date("2025-03-30T09:50:00Z");
  let biweeklyDate = new Date("2025-03-29T21:50:00Z");
  const startDate = new Date("2020-01-01T00:00:00Z");

  while (weeklyContestId >= 300 && weeklyDate >= startDate) {
    contests.push({
      contestType: "Weekly",
      contestId: `${weeklyContestId}`,
      date: new Date(weeklyDate),
    });
    weeklyDate.setDate(weeklyDate.getDate() - 7);
    weeklyContestId--;
    if (biweeklyContestId >= 85 && biweeklyDate >= startDate) {
      contests.push({
        contestType: "Biweekly",
        contestId: `${biweeklyContestId}`,
        date: new Date(biweeklyDate),
      });
      biweeklyDate.setDate(biweeklyDate.getDate() - 14);
      biweeklyContestId--;
    }
  }
  await Contest.insertMany(contests);
  return res
    .status(200)
    .json(new ApiResponse(200, "populate successfully", contests.length));
});

const removeOldContests = asyncHandler(async (req, res) => {
  const weeklyThreshold = 451;
  const biweeklyThreshold = 157;

  const result = await Contest.deleteMany({
    $or: [
      { contestType: "Weekly", contestId: { $lt: `${weeklyThreshold}` } },
      { contestType: "Biweekly", contestId: { $lt: `${biweeklyThreshold}` } },
    ],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: result.deletedCount },
        "Old contests removed successfully"
      )
    );
});

export { addContest, getAllContests, populateContests, removeContest,removeOldContests };
