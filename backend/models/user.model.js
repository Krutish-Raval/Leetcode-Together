import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const friendsSchema = new mongoose.Schema({
  leetcodeId: {
    type: String,
    required: [true, "Leetcode Id is required"],
    unique: true,
    index: true,
  },
  friendName: {
    type: String,
    required: [true, "Name is required"],
    index: true,
    unique: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
    },

    leetcodeId: {
      type: String,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      index: true,
    },

    password: {
      type: String,
      unique: true,
      required: [true, "Password is required"],
    },

    friends: {
      type: [friendsSchema],
    },

    friendOf: {
      type: [friendsSchema],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    solutionPosted:{
      type: [Schema.Types.ObjectId],
      ref: "SolutionPost",
      default: [],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", userSchema);
