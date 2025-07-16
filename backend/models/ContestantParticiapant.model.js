import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema({
  questionId: { type: Number, required: true },
  submissionId: { type: Number, required: true },
  lang: { type: String, required: true },
  failCount: { type: Number, required: true },
  date: { type: Number, required: true }
}, { _id: false });

const participantPerformanceSchema = new Schema({
  contestType: { type: String, required: true, index: true },
  contestId: { type: Number, required: true, index: true },
  leetcodeId: { type: String, required: true, index: true },

  rank: { type: Number, required: true },
  score: { type: Number, required: true },
  finishTime: { type: Number, required: true },
  submissions: [submissionSchema]
}, { timestamps: true });

// Ensure uniqueness per contestType + contestId + user
participantPerformanceSchema.index(
  { contestType: 1, contestId: 1, leetcodeId: 1 },
  { unique: true }
);

export const ContestantParticipant = mongoose.model("ContestantParticipant", participantPerformanceSchema);
