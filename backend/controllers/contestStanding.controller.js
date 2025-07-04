import { Contest } from "../models/contestantStandings.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add/Update contest data
const saveContestData = asyncHandler(async (req, res) => {
  const { contestId, date, totalParticipants, questions, participants } =
    req.body;

  if (!contestId || !questions?.length || !participants?.length) {
    throw new ApiError(400, "Missing contestId, questions or participants");
  }

  const formattedQuestions = questions.map((q, index) => ({
    label: String.fromCharCode(65 + index), // 'A', 'B', 'C', ...
    questionId: q.question_id,
    title: q.title,
    titleSlug: q.title_slug,
    credit: q.credit,
  }));

  const formattedParticipants = participants.map((user) => ({
    leetcodeId: user.user_slug,
    rank: user.rank,
    score: user.score,
    finishTime: user.finish_time,
    submissions: Object.values(user.submissions || {}).map((sub) => ({
      questionId: sub.question_id,
      submissionId: sub.submission_id,
      lang: sub.lang,
      failCount: sub.fail_count,
      date: sub.date,
    })),
  }));

  const contest = await Contest.findOneAndUpdate(
    { contestId },
    {
      contestId,
      date,
      totalParticipants,
      questions: formattedQuestions,
      participants: formattedParticipants,
    },
    { upsert: true, new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, contest, "Contest data saved successfully"));
});

// Fetch data by user
const getUserContestPerformance = asyncHandler(async (req, res) => {
  const { leetcodeId } = req.params;

  const contests = await Contest.find({
    "participants.leetcodeId": leetcodeId,
  }).select("contestId date questions participants");

  const userContests = contests.map((contest) => {
    const user = contest.participants.find((p) => p.leetcodeId === leetcodeId);
    return {
      contestId: contest.contestId,
      date: contest.date,
      rank: user.rank,
      score: user.score,
      finishTime: user.finishTime,
      submissions: user.submissions,
      questions: contest.questions,
    };
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, userContests, "Fetched user contest performance")
    );
});

export { getUserContestPerformance, saveContestData };
