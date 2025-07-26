import { processLCCNContest } from "../controllers/lccnInfo.controller.js"; 
import { Contest } from "../models/contest.model.js"; 
import { ContestantParticipant } from "../models/ContestantParticiapant.model.js";
import { ContestMetadata } from "../models/contestMetadata.model.js";
import { LccnContestInfo } from "../models/lccnContestInfo.model.js";
const isSameDate = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isAlternateSaturday = (lastDate) => {
  const now = new Date();
  return isSameDate(now, new Date(lastDate));
};

const deleteOldestContest = async (contestType, deleteIndex) => {
  const contests = await Contest.find({ contestType }).sort({ contestId: -1 });

  if (contests.length <= deleteIndex) return;

  const contestToDelete = contests[deleteIndex];

  if (!contestToDelete) return;

  const contestId = contestToDelete.contestId;

  console.log(`Deleting ${contestType} Contest ID: ${contestId}`);

  await Promise.all([
    ContestantParticipant.deleteMany({ contestType: contestType.toLowerCase(), contestId }),
    ContestMetadata.deleteMany({ contestType: contestType.toLowerCase(), contestId }),
    LccnContestInfo.deleteMany({ contest_type: contestType.toLowerCase(), contestId }),
  ]);
};

export const autoFetchLccnContest = async () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  // console.log(`Today is ${now.toDateString()}, Day: ${day}`);

  //const latestWeekly = await Contest.findOne({ contest_type: "weekly" }).sort({ contest_id: -1 });
  //const latestBiweekly = await LccnContestInfo.findOne({ contest_type: "biweekly" }).sort({ contest_id: -1 });
  const latestWeekly = await Contest.findOne({ contestType: "Weekly" }).sort({ contestId: -1 });
  const latestBiweekly = await Contest.findOne({ contestType: "Biweekly" }).sort({ contestId: -1 });
  if (day === 0) {
    const nextWeeklyId = latestWeekly.contestId;
    console.log(`📦 Fetching Weekly Contest ID: ${nextWeeklyId}`);
    await processLCCNContest("weekly", nextWeeklyId);
    await deleteOldestContest("weekly", 17); // Delete the 18th oldest contest
  }
  if (day === 6 && isAlternateSaturday(latestBiweekly.date)) {
    const nextBiweeklyId = latestBiweekly.contestId;
    console.log(`📦 Fetching Biweekly Contest ID: ${nextBiweeklyId}`);
    await processLCCNContest("biweekly", nextBiweeklyId);
    await deleteOldestContest("biweekly", 9); // Delete the 10th oldest contest
  }
  // if (day === 0 ) {
  //   const nextBiweeklyId = latestBiweekly.contestId;
  //   console.log(`📦 Fetching Biweekly Contest ID: ${nextBiweeklyId}`);
  //   await processLCCNContest("biweekly", nextBiweeklyId);
  // }
};
