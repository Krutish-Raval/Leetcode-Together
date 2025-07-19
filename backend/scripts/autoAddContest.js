import mongoose from "mongoose";
import { autoAddContest } from "../Automation/addContest.js";
import connectDB from './db/index.js';

await connectDB();

try {
  await autoAddContest();
} catch (err) {
  console.error("Failed to auto add contest:", err);
} finally {
  await mongoose.disconnect();
}