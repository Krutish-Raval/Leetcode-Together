import axios from "axios";
import { ContestantStanding } from "../models/contestStanding.model.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();

const populateContestStandings = asyncHandler(async (req, res) => {
  const weeklyRange = { start: 405, end: 457 };
  const biweeklyRange = { start: 134, end: 160 };
  const region = "global";
  const concurrency = 5;
  const contestsProcessed = [];

  const fetchAndSaveContest = async (contestType, contestId) => {
    const slug = `${contestType.toLowerCase()}-contest-${contestId}`;
    const baseUrl = `https://leetcode.com/contest/api/ranking/${slug}`;
    const firstPageUrl = `${baseUrl}/?pagination=1&region=${region}`;

    // const { data: firstPage } = await axios.get(firstPageUrl, {
    //   headers: {
    //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    //     Referer: "https://leetcode.com/",
    //     Accept: "application/json",
    //   },
    // });
   // console.log(process.env.LEETCODE_COOKIE);
   const cookieHeader = `LEETCODE_SESSION=${process.env.LEETCODE_SESSION}; csrftoken=${process.env.LEETCODE_CSRF}`;
    const { data: firstPage } = await axios.get(firstPageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Referer: "https://leetcode.com/",
        Accept: "application/json",
        Cookie: cookieHeader,
        "X-CSRFToken": process.env.LEETCODE_CSRF, // Adding CSRF token for security
      },
    });

    const totalUsers = firstPage.user_num;
    const totalPages = Math.ceil(totalUsers / 25);  
    const questionsRaw = firstPage.questions;
    const time = firstPage.time;
    const date = Math.floor(time * 1000); // converting seconds to milliseconds

    const labels = ["A", "B", "C", "D"];
    const questions = questionsRaw.map((q, i) => ({
      label: labels[i],
      questionId: q.question_id,
      title: q.title,
      titleSlug: q.title_slug,
      credit: q.credit,
    }));

    const participantsMap = new Map();

    const fetchPage = async (page) => {
      // const { data } = await axios.get(
      //   `${baseUrl}?pagination=${page}&region=${region}`,
      //   {
      //     headers: {
      //       "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      //       Referer: "https://leetcode.com/",
      //       Accept: "application/json",
      //     },
      //   }
      // );
      console.log(process.env.LEETCODE_COOKIE);
      const { data } = await axios.get(
        `${baseUrl}?pagination=${page}&region=${region}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            Referer: "https://leetcode.com/",
            Accept: "application/json",
            Cookie: cookieHeader,
              "X-CSRFToken": process.env.LEETCODE_CSRF,
            
          },
        }
      );

      for (let i = 0; i < data.total_rank.length; i++) {
        const user = data.total_rank[i];
        const username = user.username;

        const rawSubmissionMap = data.submissions[i];

        const submissions = Object.values(rawSubmissionMap).map((s) => ({
          questionId: s.question_id,
          submissionId: s.submission_id,
          lang: s.lang,
          failCount: s.fail_count,
          date: s.date,
        }));

        const safeUsername = username
          .replace(/\./g, "_DOT_")
          .replace(/\$/g, "_DOLLAR_");

        participantsMap.set(safeUsername, {
          rank: user.rank,
          score: user.score,
          finishTime: user.finish_time,
          submissions,
        });
      }
    };
   // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 1; i <= totalPages; i += concurrency) {
      const batch = [];
      for (let j = i; j < i + concurrency && j <= totalPages; j++) {
        batch.push(fetchPage(j));
      }
      await Promise.allSettled(batch);
      // await delay(400); // Delay of 400ms between batches
    }

    const participants = Object.fromEntries(participantsMap);

    await ContestantStanding.findOneAndUpdate(
      { contestType, contestId },
      {
        contestType,
        contestId,
        totalParticipants: totalUsers,
        date,
        questions,
        participants,
      },
      { upsert: true, new: true }
    );

    contestsProcessed.push(`${contestType} ${contestId}`);
  };

  // for (let i = weeklyRange.start; i <= weeklyRange.end; i++) {
  try {
    //await fetchAndSaveContest("Weekly", 455);
  } catch (error) {
    //console.error(`Failed Weekly ${455}: ${error.message}`);
  }
  // }

  //for (let i = biweeklyRange.start; i <= biweeklyRange.end; i++) {
  try {
    await fetchAndSaveContest("Biweekly", 159);
  } catch (error) {
    console.error(`Failed Biweekly ${159}: ${error.message}`);
  }
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { contests: contestsProcessed },
        "All contests populated successfully"
      )
    );
});


export { populateContestStandings };
