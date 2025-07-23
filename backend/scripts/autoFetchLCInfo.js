import mongoose from "mongoose";
import connectDB from "../db/index.js";
import { autoFetchLCInfo } from "../Automation/autoFetchLCInfo.js";

await connectDB();

try {
  console.log("Starting automatic LeetCode contest fetch...");
  await autoFetchLCInfo();
} catch (err) {
  console.error("Failed to fetch LeetCode contest:", err);
} finally {
  await mongoose.disconnect();
}
