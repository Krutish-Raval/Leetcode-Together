import mongoose, { Schema } from "mongoose";

// Question Schema with A, B, C, D label
const questionSchema = new Schema({
  label: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  questionId: { type: Number, required: true },
  title: { type: String, required: true },
  titleSlug: { type: String, required: true },
  credit: { type: Number, required: true }
}, { _id: false });

// Submission per question
const submissionSchema = new Schema({
  questionId: { type: Number, required: true },
  submissionId: { type: Number, required: true },
  lang: { type: String, required: true },
  failCount: { type: Number, required: true },
  date: { type: Number, required: true }
}, { _id: false });

// Performance per user, stored in a map
const participantPerformanceSchema = new Schema({
  rank: { type: Number, required: true },
  score: { type: Number, required: true },
  finishTime: { type: Number, required: true },
  submissions: [submissionSchema]
}, { _id: false });

const contestSchema = new Schema({
  contestType: { type: String, required: true }, // e.g. weekly
  contestId: { type: Number, required: true },   // e.g. 456
  totalParticipants: { type: Number, required: true },
  date: { type: Number, required: true },

  questions: [questionSchema], // with labels A, B, C, D

  participants: {
    type: Map,
    of: participantPerformanceSchema // key = leetcodeId
  }
}, { timestamps: true });

export const ContestantStanding = mongoose.model("ContestStanding", contestSchema);
