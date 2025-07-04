import mongoose, { Schema } from "mongoose";

// Question inside a contest (A, B, C, D)
const questionSchema = new Schema(
  {
    label: { type: String, enum: ["A", "B", "C", "D"], required: true },
    questionId: { type: Number, required: true },
    title: { type: String, required: true },
    titleSlug: { type: String, required: true },
    credit: { type: Number, required: true },
  },
  { _id: false }
);

// Submission info for a particular question by a user
const submissionSchema = new Schema(
  {
    questionId: { type: Number, required: true },
    submissionId: { type: Number, required: true },
    lang: { type: String, required: true },
    failCount: { type: Number, required: true },
    date: { type: Number, required: true },
  },
  { _id: false }
);

// User performance in a contest
const userPerformanceSchema = new Schema(
  {
    leetcodeId: { type: String, required: true },
    rank: { type: Number, required: true },
    score: { type: Number, required: true },
    finishTime: { type: Number, required: true },
    submissions: [submissionSchema],
  },
  { _id: false }
);

const contestSchema = new Schema(
  {
    contestId: { type: Number, required: true, unique: true },
    contestType:{type: String,enum:["Weekly","Biweekly"]},
    totalParticipants: { type: Number, required: true },
    date: { type: Number, required: true },
    questions: [questionSchema],  
    participants: [userPerformanceSchema],
  },
  { timestamps: true }
);

export const Contest = mongoose.model("Contest", contestSchema);
