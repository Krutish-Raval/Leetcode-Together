import { LccnContestInfo } from "../models/lccnContestInfo.model.js";
import { processLCCNContest } from "../controllers/lccnInfo.controller.js"; // Exported separately now

const isAlternateSaturday = (lastDate) => {
  const now = new Date();
  const diffDays = Math.floor((now - new Date(lastDate)) / (1000 * 60 * 60 * 24));
  return now.getDay() === 6 && diffDays >= 14;
};

export const autoFetchLccnContest = async () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  console.log(`Today is ${now.toDateString()}, Day: ${day}`);

  const latestWeekly = await LccnContestInfo.findOne({ contest_type: "weekly" }).sort({ contest_id: -1 });
  const latestBiweekly = await LccnContestInfo.findOne({ contest_type: "biweekly" }).sort({ contest_id: -1 });

  if (day === 0 && latestWeekly) {
    const nextWeeklyId = latestWeekly.contest_id + 1;
    console.log(`📦 Fetching Weekly Contest ID: ${nextWeeklyId}`);
    await processLCCNContest("weekly", nextWeeklyId);
  }

  if (day === 6 && latestBiweekly && isAlternateSaturday(latestBiweekly.createdAt)) {
    const nextBiweeklyId = latestBiweekly.contest_id + 1;
    console.log(`📦 Fetching Biweekly Contest ID: ${nextBiweeklyId}`);
    await processLCCNContest("biweekly", nextBiweeklyId);
  }
};
