import mongoose from "mongoose";
import { autoAddContest } from "../Automation/addContest.js";
import connectDB from "../db/index.js";

await connectDB();

try {
    console.log("Starting automatic contest addition...");
  await autoAddContest();
} catch (err) {
  console.error("Failed to auto add contest:", err);
} finally {
  await mongoose.disconnect();
}