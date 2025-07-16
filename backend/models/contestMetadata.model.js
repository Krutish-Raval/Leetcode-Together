import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
  label: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  questionId: { type: Number, required: true },
  title: { type: String, required: true },
  titleSlug: { type: String, required: true },
  credit: { type: Number, required: true }
}, { _id: false });

const contestMetadataSchema = new Schema({
  contestType: { type: String, required: true }, // weekly, biweekly, etc.
  contestId: { type: Number, required: true, unique: true },
  totalParticipants: { type: Number, required: true },
  date: { type: Number, required: true },
  questions: [questionSchema]
}, { timestamps: true });

export const ContestMetadata = mongoose.model("ContestMetadata", contestMetadataSchema);