import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser= asyncHandler(async (req,res,next)=>{
    // get user details
    // validation email in correct format and all required non empty
    // check if user already exists email,leetcodeId
    // create user object - create entry db
    // remove password and refresh token from response
    // check for user creation

    const {name, leetcodeId, email, password} = req.body;
    console.log("name: ", name);
    console.log("leetcodeId: ", leetcodeId);

    if(
        [name, leetcodeId, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }
    else if(!validator.isEmail(email)){
        throw new ApiError(400, "Invalid Email format");
    }
    const existedUser=await User.findOne({
        $or: [{email},{name}]
    })
    console.log("existedUser: ", existedUser);
    if(existedUser){
        throw new ApiError(402, "User already exists");
    }
    const user =await User.create({
        name: name.toLowerCase(),
        leetcodeId,
        email,
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // console.log("createdUser: ", createdUser);

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", createdUser)
    )
    // res.status(200).json({
    //     success: true,
    //     message: "ok"
    // })
})

export {registerUser}