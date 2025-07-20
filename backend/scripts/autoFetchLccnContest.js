import mongoose from "mongoose";
import connectDB from "../db/index.js";
import { autoFetchLccnContest } from "../Automation/autoFetchLccnContest.js";

await connectDB();

try {
  console.log("Starting automatic LCCN contest fetch...");
  await autoFetchLccnContest();
} catch (err) {
  console.error("Failed to fetch LCCN contest:", err);
} finally {
  await mongoose.disconnect();
}
