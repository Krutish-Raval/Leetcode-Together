import mongoose from "mongoose";

const signinSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      unique: true,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

export const Signin = mongoose.model("Signin", signinSchema);
