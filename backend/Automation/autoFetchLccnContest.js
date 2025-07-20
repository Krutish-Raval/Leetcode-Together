import { LccnContestInfo } from "../models/lccnContestInfo.model.js";
import { processLCCNContest } from "../controllers/lccnInfo.controller.js"; // Exported separately now
import { Contest } from "../models/contest.model.js"; // Assuming you have a Contest model for weekly contests
const isAlternateSaturday = (lastDate) => {
  const now = new Date();
  const diffDays = Math.floor((now - new Date(lastDate)) / (1000 * 60 * 60 * 24));
  console.log(`Last contest date: ${lastDate}, Days since last contest: ${diffDays}`);
  return now.getDay() === 6 && diffDays >= 14;
};

export const autoFetchLccnContest = async () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  console.log(`Today is ${now.toDateString()}, Day: ${day}`);

  //const latestWeekly = await Contest.findOne({ contest_type: "weekly" }).sort({ contest_id: -1 });
  //const latestBiweekly = await LccnContestInfo.findOne({ contest_type: "biweekly" }).sort({ contest_id: -1 });
   const latestWeekly = await Contest.findOne({ contestType: "Weekly" }).sort({ contestId: -1 });
    const latestBiweekly = await Contest.findOne({ contestType: "Biweekly" }).sort({ contestId: -1 });
  // if (day === 0) {
  //   const nextWeeklyId = latestWeekly.contestId + 1;
  //   console.log(`📦 Fetching Weekly Contest ID: ${nextWeeklyId}`);
  //   await processLCCNContest("weekly", nextWeeklyId);
  // }
 /// console.log(latestBiweekly);
  // if (day === 6 && isAlternateSaturday(latestBiweekly.date)) {
  //   const nextBiweeklyId = latestBiweekly.contestId + 1;
  //   console.log(`📦 Fetching Biweekly Contest ID: ${nextBiweeklyId}`);
  //   await processLCCNContest("biweekly", nextBiweeklyId);
  // }
  if (day === 0 ) {
    const nextBiweeklyId = latestBiweekly.contestId;
    console.log(`📦 Fetching Biweekly Contest ID: ${nextBiweeklyId}`);
    await processLCCNContest("biweekly", nextBiweeklyId);
  }
};
