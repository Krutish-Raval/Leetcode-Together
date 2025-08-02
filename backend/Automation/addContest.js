import { Contest } from "../models/contest.model.js";

const isAlternateSaturday = (lastDate) => {
  const now = new Date();
  const diffDays = Math.floor((now - new Date(lastDate)) / (1000 * 60 * 60 * 24));
  console.log(`Days since last biweekly: ${diffDays}`);
  return now.getDay() === 6 && diffDays >= 13;
};

export const autoAddContest = async()=> {
  const now = new Date();
  const day = now.getDay();
  console.log(`Today is ${now.toDateString()}, Day: ${day}`);
  const latestWeekly = await Contest.findOne({ contestType: "Weekly" }).sort({ contestId: -1 });
  const latestBiweekly = await Contest.findOne({ contestType: "Biweekly" }).sort({ contestId: -1 });
  if (day === 0) {
    const newWeekly = {
      contestType: "Weekly",
      contestId: latestWeekly.contestId + 1,
      date: new Date(new Date(latestWeekly.date).getTime() + 7 * 24 * 60 * 60 * 1000)
    };
    await Contest.create(newWeekly);
    console.log(`Adding weekly contest ${latestWeekly.contestId + 1}`);
    const removeWeeklyId = latestWeekly.contestId - 17;
    await Contest.deleteOne({ contestType: "Weekly", contestId: removeWeeklyId });
    console.log(`Removing weekly contest ${removeWeeklyId}`);
  }
  else if (day===6 && isAlternateSaturday(latestBiweekly.date)) {
    const newBiweekly = {
      contestType: "Biweekly",
      contestId: latestBiweekly.contestId + 1,
      date: new Date(new Date(latestBiweekly.date).getTime() + 14 * 24 * 60 * 60 * 1000)
    };
    console.log(`Adding biweekly contest ${latestBiweekly.contestId + 1}`);
    await Contest.create(newBiweekly);
    const removeBiweeklyId = latestBiweekly.contestId - 9;
    await Contest.deleteOne({ contestType: "Biweekly", contestId: removeBiweeklyId });
    console.log(`Removing biweekly contest ${removeBiweeklyId}`);
  }
};  