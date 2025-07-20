import { LccnContestInfo } from "../models/lccnContestInfo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import pLimit from "p-limit";

const PAGE_SIZE = 25;
const MAX_RETRIES = 20;
const MAX_CONCURRENT_CONTESTS = 5;
const MAX_CONCURRENT_PAGES = 10; // higher = faster; reduce if rate limits occur

const fetchAndStoreLCCNContests = asyncHandler(async (req, res) => {
  const weeklyRange = { start: 451, end: 452 };
  const biweeklyRange = { start: 157, end: 158 };

  const contests = [];

  // for (let i = weeklyRange.start; i <= weeklyRange.end; i++) {
  //   contests.push({ type: "weekly", id: i });
  // }

  for (let i = biweeklyRange.start; i <= biweeklyRange.end; i++) {
    contests.push({ type: "biweekly", id: i });
  }

  const results = [];

  for (let i = 0; i < contests.length; i += MAX_CONCURRENT_CONTESTS) {
    const batch = contests.slice(i, i + MAX_CONCURRENT_CONTESTS);
    const batchResults = await Promise.allSettled(
      batch.map(({ type, id }) => processLCCNContest(type, id))
    );
    results.push(...batchResults);
  }

  const failed = results.filter((r) => r.status === "rejected").length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: results.length,
        success: results.length - failed,
        failed,
      },
      "LCCN contests processed."
    )
  );
});

export async function processLCCNContest(contestType, contestId) {
  const slug = `${contestType}-contest-${contestId}`;
  const totalCount = await fetchLccnCount(slug);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  console.log(totalPages);
  const limit = pLimit(MAX_CONCURRENT_PAGES);

  const skips = Array.from({ length: totalPages }, (_, i) => i * PAGE_SIZE);

  const results = await Promise.allSettled(
    skips.map((skip) =>
      limit(() =>
        retry(() => fetchLccnPage(slug, skip), MAX_RETRIES).then(async (pageData) => {
          if (!pageData || pageData.length === 0) return;

          const ops = pageData.map((user) => ({
            updateOne: {
              filter: {
                contest_id: contestId,
                username: user.username,
                contest_type: contestType,
              },
              update: {
                $set: {
                  username: user.username,
                  contest_id: contestId,
                  contest_type: contestType,
                  rank: user.rank,
                  score: user.score,
                  old_rating: user.old_rating,
                  new_rating: user.new_rating,
                  delta_rating: user.delta_rating,
                },
              },
              upsert: true,
            },
          }));

          if (ops.length > 0) {
            await LccnContestInfo.bulkWrite(ops);
            console.log(`✅ Stored ${ops.length} users for ${slug} (skip=${skip})`);
          }
        })
      )
    )
  );

  console.log(`✅ Completed ${slug}`);
}


async function fetchLccnCount(slug) {
  const url = `https://lccn.lbao.site/api/v1/contest-records/count?contest_name=${slug}&archived=false`;
  const res = await fetch(url);
  //console.log(res);
  if (!res.ok) throw new Error(`Failed to fetch count for ${slug} - ${res.status}`);
  const data = await res.json();
  //console.log(data);
  return data || 0;
}

async function fetchLccnPage(slug, skip) {
  const url = `https://lccn.lbao.site/api/v1/contest-records/?contest_name=${slug}&archived=false&skip=${skip}&limit=${PAGE_SIZE}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch ${slug} (skip=${skip}) - ${res.status}`);
  const data = await res.json();
  return data || [];
}

async function retry(fn, maxRetries) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      console.warn(`Retry ${attempt}/${maxRetries} failed: ${err.message}`);
      await new Promise((res) => setTimeout(res, 1000 + 1000 * attempt));
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

  const getFriendsLCCNPerformance = asyncHandler(async (req, res) => {
    const { contestName: contest_name, friends } = req.body;

    if (!contest_name || !Array.isArray(friends) || friends.length === 0) {
      throw new ApiError(400, "contest_name and non-empty friends array are required");
    }
   
    // Extract contestType and contestId
    const [type, , idStr] = contest_name.split("-");
    const contestType = type;
    const contestId = parseInt(idStr);
    //console.log(contestType, contestId, friends);
    if (!["weekly", "biweekly"].includes(contestType) || isNaN(contestId)) {
      throw new ApiError(400, "Invalid contest name format");
    }

    // Fetch data from LccnContestInfo
    const participants = await LccnContestInfo.find({
      contest_type: contestType,
      contest_id: contestId,
      username: { $in: friends },
    });

    const friendMap = {};
    for (const friend of friends) {
      friendMap[friend] = {
        username: friend,
        rank: null,
        score: null,
        old_rating: null,
        new_rating: null,
        delta_rating: null,
      };
    }
    
    for (const p of participants) {
      if (friendMap[p.username]) {
        friendMap[p.username] = {
          username: p.username,
          rank: p.rank,
          score: p.score,
          old_rating: p.old_rating,
          new_rating: p.new_rating,
          delta_rating: p.delta_rating,
        };
      }
    }

    const friendData = Object.values(friendMap)

    return res.status(200).json(new ApiResponse(200, friendData, "LCCN Friends Ranking"));
  });

export { fetchAndStoreLCCNContests,getFriendsLCCNPerformance  };
