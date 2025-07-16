// import axios from "axios";
// import { ContestantStanding } from "../models/contestStanding.model.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import dotenv from "dotenv";
// dotenv.config();

// const populateContestStandings = asyncHandler(async (req, res) => {
//   const weeklyRange = { start: 405, end: 457 };
//   const biweeklyRange = { start: 134, end: 160 };
//   const region = "global";
//   const concurrency = 5;
//   const contestsProcessed = [];

//   const fetchAndSaveContest = async (contestType, contestId) => {
//     const slug = `${contestType.toLowerCase()}-contest-${contestId}`;
//     const baseUrl = `https://leetcode.com/contest/api/ranking/${slug}`;
//     const firstPageUrl = `${baseUrl}/?pagination=1&region=${region}`;

//     // const { data: firstPage } = await axios.get(firstPageUrl, {
//     //   headers: {
//     //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
//     //     Referer: "https://leetcode.com/",
//     //     Accept: "application/json",
//     //   },
//     // });
//    // console.log(process.env.LEETCODE_COOKIE);
//    const cookieHeader = `LEETCODE_SESSION=${process.env.LEETCODE_SESSION}; csrftoken=${process.env.LEETCODE_CSRF}`;
//     const { data: firstPage } = await axios.get(firstPageUrl, {
//       headers: {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
//         Referer: "https://leetcode.com/",
//         Accept: "application/json",
//         Cookie: cookieHeader,
//         "X-CSRFToken": process.env.LEETCODE_CSRF, // Adding CSRF token for security
//       },
//     });

//     const totalUsers = firstPage.user_num;
//     const totalPages = Math.ceil(totalUsers / 25);
//     const questionsRaw = firstPage.questions;
//     const time = firstPage.time;
//     const date = Math.floor(time * 1000); // converting seconds to milliseconds

//     const labels = ["A", "B", "C", "D"];
//     const questions = questionsRaw.map((q, i) => ({
//       label: labels[i],
//       questionId: q.question_id,
//       title: q.title,
//       titleSlug: q.title_slug,
//       credit: q.credit,
//     }));

//     const participantsMap = new Map();

//     const fetchPage = async (page) => {
//       // const { data } = await axios.get(
//       //   `${baseUrl}?pagination=${page}&region=${region}`,
//       //   {
//       //     headers: {
//       //       "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
//       //       Referer: "https://leetcode.com/",
//       //       Accept: "application/json",
//       //     },
//       //   }
//       // );
//       console.log(process.env.LEETCODE_COOKIE);
//       const { data } = await axios.get(
//         `${baseUrl}?pagination=${page}&region=${region}`,
//         {
//           headers: {
//             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
//             Referer: "https://leetcode.com/",
//             Accept: "application/json",
//             Cookie: cookieHeader,
//               "X-CSRFToken": process.env.LEETCODE_CSRF,

//           },
//         }
//       );

//       for (let i = 0; i < data.total_rank.length; i++) {
//         const user = data.total_rank[i];
//         const username = user.username;

//         const rawSubmissionMap = data.submissions[i];

//         const submissions = Object.values(rawSubmissionMap).map((s) => ({
//           questionId: s.question_id,
//           submissionId: s.submission_id,
//           lang: s.lang,
//           failCount: s.fail_count,
//           date: s.date,
//         }));

//         const safeUsername = username
//           .replace(/\./g, "_DOT_")
//           .replace(/\$/g, "_DOLLAR_");

//         participantsMap.set(safeUsername, {
//           rank: user.rank,
//           score: user.score,
//           finishTime: user.finish_time,
//           submissions,
//         });
//       }
//     };
//    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//     for (let i = 1; i <= totalPages; i += concurrency) {
//       const batch = [];
//       for (let j = i; j < i + concurrency && j <= totalPages; j++) {
//         batch.push(fetchPage(j));
//       }
//       await Promise.allSettled(batch);
//       // await delay(400); // Delay of 400ms between batches
//     }

//     const participants = Object.fromEntries(participantsMap);

//     await ContestantStanding.findOneAndUpdate(
//       { contestType, contestId },
//       {
//         contestType,
//         contestId,
//         totalParticipants: totalUsers,
//         date,
//         questions,
//         participants,
//       },
//       { upsert: true, new: true }
//     );

//     contestsProcessed.push(`${contestType} ${contestId}`);
//   };

//   // for (let i = weeklyRange.start; i <= weeklyRange.end; i++) {
//   try {
//     //await fetchAndSaveContest("Weekly", 455);
//   } catch (error) {
//     //console.error(`Failed Weekly ${455}: ${error.message}`);
//   }
//   // }

//   //for (let i = biweeklyRange.start; i <= biweeklyRange.end; i++) {
//   try {
//     await fetchAndSaveContest("Biweekly", 159);
//   } catch (error) {
//     console.error(`Failed Biweekly ${159}: ${error.message}`);
//   }
//   // }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { contests: contestsProcessed },
//         "All contests populated successfully"
//       )
//     );
// });
// import fetch from "node-fetch";
import dotenv from "dotenv";
import { ContestantParticipant } from "../models/ContestantParticiapant.model.js";
import { ContestMetadata } from "../models/contestMetadata.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
dotenv.config();
const MAX_CONCURRENT_PAGES = 4;
const PAGE_SIZE = 25;
const MAX_RETRIES = 10;
const LEETCODE_SESSION = process.env.LEETCODE_SESSION; // in .env file
const headers = {
  Cookie: `LEETCODE_SESSION=${LEETCODE_SESSION}`,
  Referer: "https://leetcode.com/",
  "User-Agent": "Mozilla/5.0",
  //"User-Agent":
  //  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  // Accept: "application/json, text/plain, */*",
  // "Accept-Language": "en-US,en;q=0.9",
  // Connection: "keep-alive",
  // "Sec-Fetch-Dest": "empty",
  // "Sec-Fetch-Mode": "cors",
  // "Sec-Fetch-Site": "same-origin",
};
const fetchAndStoreLeetcodeContests = asyncHandler(async (req, res, next) => {
  const weeklyRange = { start: 451, end: 452 };
  const biweeklyRange = { start: 157, end: 158 };

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
  //console.log(contentType);
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
    await delay(1000); // throttle between concurrent batches
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
          leetcodeId: userInfo.username,
        },
        update: {
          $set: {
            contestType,
            contestId,
            leetcodeId: userInfo.username,
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
      await delay(1000 + 500 * attempt);
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { fetchAndStoreLeetcodeContests };
