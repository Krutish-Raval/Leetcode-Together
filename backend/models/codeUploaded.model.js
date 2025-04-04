import mongoose, { Schema } from "mongoose";

const codeUploadSchema= new Schema({

    uploadedBy:{
       type:String,
       required:true
    },

    code:{
        type:String,
        required:true
    },

    questionNo:{
        type:String,
        required: true
    },

    contestName:{
        type:String,
        required:true
    }

},
{
    timestamps:true
})

export const CodeUpload= new mongoose.model("CodeUpload",codeUploadSchema);