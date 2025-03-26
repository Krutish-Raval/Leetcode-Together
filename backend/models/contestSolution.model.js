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

contestSolutionSchema.index({ contestType: 1, contestId: 1, questionNo: 1 });

export const ContestSolution = mongoose.model("ContestSolution",contestSolutionSchema);