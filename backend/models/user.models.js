import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
    },
    leetcodeId:{
        type: String,
        required: [true, "Leetcode Id is required"],
        unique: true,
    },
    email:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Signin",
    }
}, { timestamps: true });