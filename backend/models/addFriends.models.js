import mongoose from "mongoose"

const freindsSchema = new mongoose.Schema({
    leetcodeId:{
      type: String,
      required: [true, "Leetcode Id is required"],
      unique: true,
      index:true,

    }

})
const addFriendsSchema = new mongoose.Schema(
  {
    friends: {
      type:[freindsSchema] ,
    },
  },
  { timestamps: true }
);

export const AddFriends = mongoose.model("AddFriends", addFriendsSchema);