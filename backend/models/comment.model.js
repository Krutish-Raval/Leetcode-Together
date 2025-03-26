import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema({
    commentOnPost:{
        type: Schema.Types.ObjectId,
        ref: "SolutionPost",
    },
    commentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    commentText: {
      type: String,
    },

});

export const Comment = mongoose.model("Comment", commentSchema);