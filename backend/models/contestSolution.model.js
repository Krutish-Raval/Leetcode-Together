import mongoose,{Schema} from "mongoose";

const contestSolutionSchema = new Schema({

    contestType:{
        type: String,
        enum:["weekly","biweekly"],
        required: [true, "Contest type is required"],
    },

    contestId:{
        type: String,
        required: [true, "Contest Id is required"],
    },

    questionNo:{
        type:Number,
        required: [true, "Question number is required"],
        min:1,
        max:4,
    },
    
    solutions:{
        type:[Schema.Types.ObjectId],
        ref:"SolutionPost",
        default: []
    }
},
{
    timestamps:true
})


export const ContestSolution = mongoose.model("ContestSolution",contestSolutionSchema);