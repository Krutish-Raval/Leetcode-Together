// import { Contest } from "../models/contest.model.js";

// const isAlternateSaturday = (lastDate) => {
//   const now = new Date();
//   const diffDays = Math.floor((now - new Date(lastDate)) / (1000 * 60 * 60 * 24));
//   return now.getDay() === 6 && diffDays >= 14;
// };

// export const autoAddContest = async()=> {
//   const now = new Date();
//   const day = now.getDay(); // 0 = Sunday, 6 = Saturday
//    //console.log(`Today is ${now.toDateString()}, Day: ${day}`);
//   const latestWeekly = await Contest.findOne({ contestType: "weekly" }).sort({ date: -1 });
//   const latestBiweekly = await Contest.findOne({ contestType: "biweekly" }).sort({ date: -1 });
//   if (day === 0) {
//     const newWeekly = {
//       contestType: "weekly",
//       contestId: latestWeekly.contestId + 1,
//       date: new Date(new Date(latestWeekly.date).getTime() + 7 * 24 * 60 * 60 * 1000)
//     };
//     await Contest.create(newWeekly);
//     console.log(`Adding weekly contest ${latestWeekly.contestId + 1}`);
//     const removeWeeklyId = latestWeekly.contestId - 17;
//     await Contest.deleteOne({ contestType: "weekly", contestId: removeWeeklyId });
//     console.log(`Removing weekly contest ${removeWeeklyId}`);
//   }
//   // else{
//   //     const newBiweekly = {
//   //     contestType: "biweekly",
//   //     contestId: latestBiweekly.contestId + 1,
//   //     date: new Date(new Date(latestBiweekly.date).getTime() + 14 * 24 * 60 * 60 * 1000)
//   //   };
//   //   console.log(`Adding biweekly contest ${latestBiweekly.contestId + 1}`);
//   //   await Contest.create(newBiweekly);
//   //   const removeBiweeklyId = latestBiweekly.contestId - 9;
//   //   await Contest.deleteOne({ contestType: "biweekly", contestId: removeBiweeklyId });
//   //   console.log(`Removing biweekly contest ${removeBiweeklyId}`);
//   // }
//   else if (isAlternateSaturday(latestBiweekly.date)) {
//     const newBiweekly = {
//       contestType: "biweekly",
//       contestId: latestBiweekly.contestId + 1,
//       date: new Date(new Date(latestBiweekly.date).getTime() + 14 * 24 * 60 * 60 * 1000)
//     };
//     console.log(`Adding biweekly contest ${latestBiweekly.contestId + 1}`);
//     await Contest.create(newBiweekly);
//     const removeBiweeklyId = latestBiweekly.contestId - 9;
//     await Contest.deleteOne({ contestType: "biweekly", contestId: removeBiweeklyId });
//     console.log(`Removing biweekly contest ${removeBiweeklyId}`);
//   }
// };

import { Contest } from "../models/contest.model.js";

const isAlternateSaturday = (lastDate) => {
  const now = new Date();
  const diffDays = Math.floor((now - new Date(lastDate)) / (1000 * 60 * 60 * 24));
  return now.getDay() === 6 && diffDays >= 14;
};

export const autoAddContest = async () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  const latestWeekly = await Contest.findOne({ contestType: "weekly" }).sort({ date: -1 });
  const latestBiweekly = await Contest.findOne({ contestType: "biweekly" }).sort({ date: -1 });

  if (day === 0) {
    const newWeeklyId = Number(latestWeekly.contestId) + 1;
    const removeWeeklyId = newWeeklyId - 17;

    const newWeekly = {
      contestType: "weekly",
      contestId: String(newWeeklyId),
      date: new Date(new Date(latestWeekly.date).getTime() + 7 * 24 * 60 * 60 * 1000),
    };

    await Contest.create(newWeekly);
    console.log(`Adding weekly contest ${newWeeklyId}`);

    await Contest.deleteOne({ contestType: "weekly", contestId: String(removeWeeklyId) });
    console.log(`Removing weekly contest ${removeWeeklyId}`);
  }

  else if (day === 6 && isAlternateSaturday(latestBiweekly.date)) {
    const newBiweeklyId = Number(latestBiweekly.contestId) + 1;
    const removeBiweeklyId = newBiweeklyId - 9;

    const newBiweekly = {
      contestType: "biweekly",
      contestId: String(newBiweeklyId),
      date: new Date(new Date(latestBiweekly.date).getTime() + 14 * 24 * 60 * 60 * 1000),
    };

    await Contest.create(newBiweekly);
    console.log(`Adding biweekly contest ${newBiweeklyId}`);

    await Contest.deleteOne({ contestType: "biweekly", contestId: String(removeBiweeklyId) });
    console.log(`Removing biweekly contest ${removeBiweeklyId}`);
  }
};
