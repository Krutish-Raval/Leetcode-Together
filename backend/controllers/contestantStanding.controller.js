import dotenv from "dotenv";
import { ContestantParticipant } from "../models/ContestantParticiapant.model.js";
import { ContestMetadata } from "../models/contestMetadata.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
dotenv.config();
const MAX_CONCURRENT_PAGES = 4;
const PAGE_SIZE = 25;
const MAX_RETRIES = 20;
const LEETCODE_SESSION = process.env.LEETCODE_SESSION;
const headers = {
  Cookie: `LEETCODE_SESSION=${LEETCODE_SESSION}`,
  Referer: "https://leetcode.com/",
  "User-Agent": "Mozilla/5.0",
};
const fetchAndStoreLeetcodeContests = asyncHandler(async (req, res, next) => {
  const weeklyRange = { start: 458, end: 459 };
  const biweeklyRange = { start: 159, end: 160 };

  const contestTasks = [];

  for (let i = weeklyRange.start; i < weeklyRange.end; i++) {
    contestTasks.push(processContest("weekly", i));
  }

  // for (let i = biweeklyRange.start; i <= biweeklyRange.end; i++) {
  //   contestTasks.push(processContest("biweekly", i));
  // }

  const results = await Promise.allSettled(contestTasks);

  const failedContests = results
    .map((res, index) => (res.status === "rejected" ? index : null))
    .filter((i) => i !== null);
  //console.log(results);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: results.length,
        success: results.length - failedContests.length,
        failed: failedContests.length,
      },
      "LeetCode contests processed."
    )
  );
});

async function processContest(contestType, contestId) {
  const slug = `${contestType}-contest-${contestId}`;
  const firstPageUrl = `https://leetcode.com/contest/api/ranking/${slug}/?pagination=1&region=global`;

  const response = await fetch(firstPageUrl, { headers });
  const contentType = response.headers.get("content-type") || "";
  //console.log(contentType.includes("application/json"));
  if (!contentType.includes("application/json")) {
    throw new ApiError(
      403,
      `${slug} blocked by Cloudflare: returned HTML instead of JSON`
    );
  }

  //console.log(response);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Failed to fetch first page for ${slug}`
    );
  }

  const firstPageData = await response.json();

  const totalUsers = firstPageData.user_num || 0;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  await storeContestMetadata(contestType, contestId, firstPageData);
  //console.log(pageNumbers.length + " total pages for " + slug);
  for (let i = 0; i < pageNumbers.length; i += MAX_CONCURRENT_PAGES) {
    const batch = pageNumbers.slice(i, i + MAX_CONCURRENT_PAGES);
    await Promise.all(
      batch.map((page) =>
        retry(
          () => fetchPageAndStore(contestType, contestId, page, slug),
          MAX_RETRIES
        )
      )
    );
    await delay(1000);
  }

  console.log(`✅ Completed ${slug}`);
}

async function fetchPageAndStore(contestType, contestId, page, slug) {
  const url = `https://leetcode.com/contest/api/ranking/${slug}/?pagination=${page}&region=global`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Page ${page} failed (HTTP ${response.status})`);
  }

  const data = await response.json();
  const bulkOperations = [];

  for (let i = 0; i < data.total_rank.length; i++) {
    const userInfo = data.total_rank[i];
    const submissionMap = data.submissions[i];

    const submissions = Object.values(submissionMap || {}).map((sub) => ({
      questionId: sub.question_id,
      submissionId: sub.submission_id,
      lang: sub.lang,
      failCount: sub.fail_count,
      date: sub.date,
    }));

    bulkOperations.push({
      updateOne: {
        filter: {
          contestType,
          contestId,
          leetcodeId: userInfo.user_slug,
        },
        update: {
          $set: {
            contestType,
            contestId,
            leetcodeId: userInfo.user_slug,
            rank: userInfo.rank,
            score: userInfo.score,
            finishTime: userInfo.finish_time,
            submissions,
          },
        },
        upsert: true,
      },
    });
  }

  if (bulkOperations.length > 0) {
    await ContestantParticipant.bulkWrite(bulkOperations);
  }

  console.log(`✅ Stored page ${page} for ${slug}`);
}

async function storeContestMetadata(contestType, contestId, data) {
  const questions = data.questions.map((q, idx) => ({
    label: String.fromCharCode(65 + idx), // A, B, C, D
    questionId: q.question_id,
    title: q.title,
    titleSlug: q.title_slug,
    credit: q.credit,
  }));

  await ContestMetadata.updateOne(
    { contestType, contestId },
    {
      $set: {
        contestType,
        contestId,
        date: Math.floor(data.time),
        totalParticipants: data.user_num,
        questions,
      },
    },
    { upsert: true }
  );
}

async function retry(fn, maxRetries) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      console.warn(`Retry ${attempt}/${maxRetries} failed: ${err.message}`);
      await delay(1000 + 1000 * attempt);
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const getFriendsContestPerformance = asyncHandler(async (req, res) => {
  const { contestName: contest_name, friends } = req.body;
  const [type, , idStr] = contest_name.split("-");
  const contestType = type;
  const contestId = parseInt(idStr);
  const participants = await ContestantParticipant.find({
    contestType,
    contestId,
    leetcodeId: { $in: friends },
  });
  // console.log(participants);
  const friendMap = {};
  for (const friend of friends) {
    friendMap[friend] = {
      username: friend,
      rank: null,
      score: null,
      finishTime: null,
      submissions: [],
    };
  }
  //console.log("Participants:", participants);
  for (const p of participants) {
    const friendEntry = friendMap[p.leetcodeId];
    if (!friendEntry) continue;
    //console.log(p);
    friendEntry.rank = p.rank;
    friendEntry.score = p.score;
    friendEntry.finishTime = p.finishTime;
   
    for (const sub of p.submissions || []) {
      friendEntry.submissions.push({
        questionId: sub.questionId,
        submissionId: sub.submissionId,
        lang: sub.lang,
        date: sub.date,
        failCount: sub.failCount || 0
      });
    }
  }
  //console.log(friendMap);
  const friendData = Object.values(friendMap).filter((f) => f.rank !== null);
  //console.log(friendData);
  return res
    .status(200)
    .json(new ApiResponse(200, friendData, "Friends ranked"));
});

const getContestData = asyncHandler(async (req, res) => {
  const { contestName } = req.query;
  const [type, , idStr] = contestName.split("-");
  const contestType = type;
  const contestId = parseInt(idStr);
  const metadata = await ContestMetadata.findOne({ contestType, contestId });
  return res
    .status(200)
    .json(new ApiResponse(200, metadata, "Contest metadata retrieved"));
});

export {
  fetchAndStoreLeetcodeContests,
  getContestData,
  getFriendsContestPerformance,
};
