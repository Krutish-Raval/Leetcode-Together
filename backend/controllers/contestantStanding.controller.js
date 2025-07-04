import { ContestantStanding } from "../models/contestantStanding.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Save or update a contest
const saveContestData = asyncHandler(async (req, res) => {
  const { contestType, contestId, date, totalParticipants, questions, participants } = req.body;

  if (!contestType || !contestId || !questions || !participants) {
    throw new ApiError(400, "Missing contestType, contestId, questions or participants");
  }

  const formattedQuestions = questions.map((q, idx) => ({
    label: String.fromCharCode(65 + idx), // 'A', 'B', ...
    questionId: q.question_id,
    title: q.title,
    titleSlug: q.title_slug,
    credit: q.credit
  }));

  const formattedParticipants = {};
  for (const user of participants) {
    formattedParticipants[user.user_slug] = {
      rank: user.rank,
      score: user.score,
      finishTime: user.finish_time,
      submissions: Object.values(user.submissions).map((sub) => ({
        questionId: sub.question_id,
        submissionId: sub.submission_id,
        lang: sub.lang,
        failCount: sub.fail_count,
        date: sub.date
      }))
    };
  }

  const contest = await ContestantStanding.findOneAndUpdate(
    { contestType, contestId },
    {
      contestType,
      contestId,
      date,
      totalParticipants,
      questions: formattedQuestions,
      participants: formattedParticipants
    },
    { new: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200, contest, "Contest data saved successfully"));
});

// Get a user's performance in a specific contest
const getUserContestPerformance = asyncHandler(async (req, res) => {
  const { contestType, contestId, leetcodeId } = req.params;

  const contest = await ContestantStanding.findOne({ contestType, contestId }).select("date questions participants");

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  const userPerformance = contest.participants.get(leetcodeId);

  if (!userPerformance) {
    throw new ApiError(404, "User not found in this contest");
  }

  return res.status(200).json(new ApiResponse(200, {
    contestType,
    contestId,
    date: contest.date,
    questions: contest.questions,
    ...userPerformance
  }));
});

// import fetch from "node-fetch";

// Constants for contest types and ranges
const CONTEST_SPECS = [
  { type: "biweekly", slugPrefix: "biweekly-contest", start: 121, end: 159 },
  { type: "weekly", slugPrefix: "weekly-contest", start: 379, end: 456 }
];

// Parses date strings like "Sunday, June 29, 2025"
function parseDateStr(dateStr) {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

// Fetch all pages for a specific contest
async function fetchContestPages(slug, contestId, region = "global") {
  let page = 1, allPages = [], totalPages;

  do {
    const url = `https://leetcode.com/contest/api/ranking/${slug}-${contestId}/?pagination=${page}&region=${region}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new ApiError(resp.status, `LeetCode API error on ${url}`);
    const json = await resp.json();

    allPages.push(json);
    totalPages = Math.ceil(json.user_num / json.total_rank.length);
    page += 1;
  } while (page <= totalPages);

  return allPages;
}

// Controller: GET /api/v1/populate-contests
const populateContests = asyncHandler(async (req, res) => {
  for (const spec of CONTEST_SPECS) {
    const { type, slugPrefix, start, end } = spec;
    for (let id = start; id <= end; id++) {
      const pages = await fetchContestPages(slugPrefix, id);
      for (const pageData of pages) {
        const { submissions, questions, total_rank, user_num } = pageData;

        // Format questions with labels (A, B, C, …)
        const formattedQuestions = questions.map((q, idx) => ({
          label: String.fromCharCode(65 + idx),
          questionId: q.question_id,
          title: q.title,
          titleSlug: q.title_slug,
          credit: q.credit
        }));

        // Merge pages for same contest
        const doc = await ContestStanding.findOne({
          contestType: type,
          contestId: id
        });

        // prepare participants map
        const participants = doc?.participants || new Map();

        total_rank.forEach(user => {
          const leet = user.user_slug;
          const existing = participants.get(leet) || { submissions: [] };

          // Grab submission for this page (if exists)
          const subs = submissions[ user.rank === 1 ? Object.keys(submissions)[0] : Object.keys(submissions)[1] ];
          if (subs) {
            existing.submissions.push({
              questionId: subs.question_id,
              submissionId: subs.submission_id,
              lang: subs.lang,
              failCount: subs.fail_count,
              date: subs.date
            });
          }

          existing.rank = user.rank;
          existing.score = user.score;
          existing.finishTime = user.finish_time;
          participants.set(leet, existing);
        });

        const contestData = {
          contestType: type,
          contestId: id,
          date: parseDateStr(pages[0].rated_forbidden || pages[0].time), // fallback
          totalParticipants: user_num,
          questions: formattedQuestions,
          participants: Object.fromEntries(participants)
        };

        await ContestStanding.findOneAndUpdate(
          { contestType: type, contestId: id },
          contestData,
          { upsert: true }
        );
      }
    }
  }

  res.json(new ApiResponse(200, {}, "All contests populated successfully"));
});

export { populateContests };

export {
  saveContestData,
  getUserContestPerformance
};
