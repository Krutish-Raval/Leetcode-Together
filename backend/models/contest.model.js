import mongoose, { Schema } from "mongoose";

const contestSchema= new Schema({
    contestType:{
        type:String,
        enum:["Weekly","Biweekly"],
        required:true
    },
    contestId:{
        type:Number,
        required:true,
        unique: true
    },
    date:{
        type:Date,
        required:true
    }
})

export const Contest= mongoose.model("Contest", contestSchema)