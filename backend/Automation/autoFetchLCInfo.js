import { Contest } from "../models/contest.model.js";
import { processContest } from "../controllers/contestantStanding.controller.js";
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

export const autoFetchLCInfo = async () => {
  const now = new Date();
  const day = now.getDay();
  const latestWeekly = await Contest.findOne({ contestType: "Weekly" }).sort({
    contestId: -1,
  });
  const latestBiweekly = await Contest.findOne({
    contestType: "Biweekly",
  }).sort({ contestId: -1 });
  if (day === 0) {
    console.log(`Fetching Weekly Contest ID: ${latestWeekly.contestId}`);
    await processContest("weekly", latestWeekly.contestId)    ;
  }
  if (day === 6 && isAlternateSaturday(latestBiweekly.date)) {
    console.log(`Fetching Biweekly Contest ID: ${latestBiweekly.contestId}`);
    await processContest("biweekly", latestBiweekly.contestId);
  }
   if (day === 3 || day === 4 || day === 5) {
    console.log("Midweek Update: Refetching Weekly...");
    await processContest("weekly", latestWeekly.contestId);

    const daysSinceBiweekly = Math.floor((now - new Date(latestBiweekly.date)) / (1000 * 60 * 60 * 24));
    if (daysSinceBiweekly <= 6) {
      console.log("Midweek Update: Refetching Biweekly...");
      await processContest("biweekly", latestBiweekly.contestId);
    } else {
      console.log("Midweek: Skipping biweekly (no recent contest).");
    }
  }
};
