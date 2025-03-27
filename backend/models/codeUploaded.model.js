import mongoose, { Schema } from "mongoose";

const codeUploadSchema= new Schema({

    uploadedBy:{
       type:Schema.Types.ObjectId,
       ref:"User"
    },

    code:{
        type:String,
        required:true
    },

    questionNo:{
        type:Number,
        required: true
    },

    contestId:{
        type:String,
        required: true
    },

    contestType:{
        type:String,
        enum:["weekly","biweekly"],
        required: true
    },

},
{
    timestamps:true
})

export const CodeUpload= new mongoose.model("CodeUpload",codeUploadSchema);