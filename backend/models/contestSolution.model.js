import mongoose, { Schema } from "mongoose";

const contestSolutionSchema = new Schema(
  {
    contestName: {
      type: String,
      required: true,
    },
    questionNo: {
      type: String,
      required: [true, "Question number is required"],
    },

    solutions: {
      type: [Schema.Types.ObjectId],
      ref: "SolutionPost",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ContestSolution = mongoose.model(
  "ContestSolution",
  contestSolutionSchema
);
