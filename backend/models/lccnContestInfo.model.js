import mongoose, { Schema } from "mongoose";

const LCCNParticipantSchema = new Schema(
  {
    username: { type: String, required: true },
    contest_id: { type: Number, required: true },
    contest_type: {
      type: String,
      enum: ["weekly", "biweekly"],
      required: true,
    },
    rank: { type: Number, required: true },
    score: { type: Number, required: true },
    old_rating: { type: Number, required: true },
    new_rating: { type: Number, required: true },
    delta_rating: { type: Number, required: true },
  },
  { timestamps: true }
);

LCCNParticipantSchema.index(
  { contest_id: 1, username: 1, contest_type: 1 },
  { unique: true }
);

export const LccnContestInfo = mongoose.model("LccnContestInfo", LCCNParticipantSchema);
