const commentSchema = new Schema({

    commentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    commentText: {
      type: String,
    },

});

export const Comment = mongoose.model("Comment", commentSchema);
