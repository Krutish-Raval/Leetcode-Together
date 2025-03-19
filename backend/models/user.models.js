import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
        required: [true, 'Password is required']
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign({
    _id: this._id,
    email: this.email,
  }, process.env.ACCESS_TOKEN_SECRET, 
  {expiresIn: process.env.ACCESS_TOKEN_EXPIRY},
  );
};
userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign({
      _id: this._id,
      email: this.email,
    }, process.env.REFRESH_TOKEN_SECRET, 
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY},
    );
  };
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", userSchema);
