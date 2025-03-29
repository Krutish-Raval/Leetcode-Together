import Router from 'express';
import { 
    registerUser,
    loginUser ,
    logOutUser ,
    refreshAccessToken,
    changeCurrentPassword,
    addFriend,
    removeFriend,
    getFriendsList,
    updateFriendProfile,
    getCurrentUser,
    updateUserDetails,
    addUserDetails,
    uploadedSolution,
    saveSolutionPost,
    getSaveSolutionPost

 } from '../controllers/user.controller.js';

import { verifyJWT}  from '../middlewares/auth.middleware.js';

import { sendVerificationOTP,resendOtp } from '../controllers/auth.controller.js';

const router = Router();

router.route("/register").post(registerUser);


router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT,logOutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-user-details").patch(verifyJWT, updateUserDetails)

router.route("/add-friend").post(verifyJWT, addFriend)

router.route("/remove-friend").delete(verifyJWT, removeFriend)

router.route("/get-friend-list").get(verifyJWT, getFriendsList)

router.route("/update-friend-profile").patch(verifyJWT, updateFriendProfile)

router.route("/add-user-details").post(verifyJWT, addUserDetails)

router.route("/uploaded-solution").get(verifyJWT,uploadedSolution)

router.route("/save-solution").post(verifyJWT,saveSolutionPost)

router.route("/get-save-solution").get(verifyJWT,getSaveSolutionPost)

router.route("/send-otp").post(sendVerificationOTP);

router.route("/resend-otp").post(resendOtp);

export default router;