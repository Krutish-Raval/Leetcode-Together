import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessTokenAndRefreshToken = async (userId) => {
    try{
        user= await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    }
    catch(err){
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}
const registerUser= asyncHandler(async (req,res,next)=>{
    // get user details
    // validation email in correct format and all required non empty
    // check if user already exists email,leetcodeId
    // create user object - create entry db
    // remove password and refresh token from response
    // check for user creation

    const {email, password} = req.body;

    if(
        [email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }
    else if(!validator.isEmail(email)){
        throw new ApiError(400, "Invalid Email format");
    }
    const existedUser=await User.findOne(
         {email}
    )
    console.log("existedUser: ", existedUser);
    if(existedUser){
        throw new ApiError(402, "User already exists");
    }
    const user =await User.create({
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

const loginUser=asyncHandler(async(req,res,next)=>{
    // take email and password
    // check if user exists
    // check if password or email is correct
    // generate access token and refresh token
    // send cookies

    const {email, password} = req.body;
    if(!email || !password){
        throw new ApiError(400, "Email and password are required");
    }
    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(404, "User does not exist");
    }
    const isPasswordCorrect = await user.verifyPassword(password); 
    if(!isPasswordCorrect){
        throw new ApiError(401, "Incorrect password");
    }
    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
        {
            user:loggedInUser,
            accessToken,
            refreshToken

        },
        "User logged in successfully"
        )
    )
})

const logOutUser=asyncHandler(async(req,res,next)=>{
    // clear cookies

    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))  
})
export {registerUser,loginUser,logOutUser}