import mongoose,{ Schema } from "mongoose";

const solutionPostSchema = new Schema({
    postedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },

    hint:[String],

    approach:[String],

    implementation:[String],

    codeSS:[String],      // cloudinary image url
    
    anyLink:[String],

    title:{
        type: String,
        required: [true, "Title is required"],
    },

    comments :{
        type: [Schema.Types.ObjectId],
        ref: "Comment",
        default: [],
    }
    

})

export const SolutionPost = mongoose.model("SolutionPost",solutionPostSchema);