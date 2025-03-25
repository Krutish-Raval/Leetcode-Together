import mongoose,{Schema} from "mongoose";

const solutionPostSchema = new Schema({
    
    title :{
        type:String,
        required:true,
    },
    
    problemId:{
        type:String,
    },

    postedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

    upvotes:{
        type:Number,
        default:0
    },

    hint: [String],

    approach:[String],
    
    implementation:[String],

    codeSchema:[String],

    codeScreenshot:[String], //cloudinary url

    anyLink:{
        type:String,
    },

    comments: {
        type:[Schema.Types.ObjectId],
        ref:"Comment"
    },

    isPublished:{
        type:Boolean,
        default:false
    },

})
const contestSolutionSchema = new Schema({
    constestId:{
        type:String,
        required:true
    },
    solutionPost:{
        type:[solutionPostSchema]
    }
})

export const contestSolution = mongoose.model("contestSolution", contestSolutionSchema);

