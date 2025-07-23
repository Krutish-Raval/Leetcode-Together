import { Contest } from "../models/contest.model.js";
import { processContest } from "../controllers/contestantStanding.controller.js";
const isAlternateSaturday = (lastDate) => {
  const now = new Date();
  const day1=lastDate.getDay();
  const day2=now.getDay();
  // const diffDays = Math.floor(
  //   (now - new Date(lastDate)) / (1000 * 60 * 60 * 24)
  // );
  // console.log(`Last contest date: ${lastDate}, Days since last contest: ${diffDays}`);
  return day1===day2;
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
    const nextWeeklyId = latestWeekly.contestId;
    console.log(`Fetching Weekly Contest ID: ${nextWeeklyId}`);
    await processContest("weekly", nextWeeklyId)    ;
  }
  if (day === 6 && isAlternateSaturday(latestBiweekly.date)) {
    const nextBiweeklyId = latestBiweekly.contestId;
    console.log(`Fetching Biweekly Contest ID: ${nextBiweeklyId}`);
    await processContest("biweekly", nextBiweeklyId);
  }
   if (day === 3 || day === 4 || day === 5) {
    console.log("Midweek Update: Refetching Weekly...");
    await processContest("weekly", weeklyId);

    const daysSinceBiweekly = Math.floor((now - new Date(latestBiweekly.date)) / (1000 * 60 * 60 * 24));
    if (daysSinceBiweekly <= 6) {
      console.log("Midweek Update: Refetching Biweekly...");
      await processContest("biweekly", biweeklyId);
    } else {
      console.log("Midweek: Skipping biweekly (no recent contest).");
    }
  }
};
