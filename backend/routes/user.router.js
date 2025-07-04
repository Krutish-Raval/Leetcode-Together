import Router from 'express';
import { 
    changeCurrentPassword,
    addFriend,
    removeFriend,
    getFriendsList,
    updateFriendProfile,
    getCurrentUser,
    addUserDetails,
    deleteAccount,
    fetchAllFriends

 } from '../controllers/user.controller.js';

import { verifyJWT}  from '../middlewares/auth.middleware.js';

import { 
    sendVerificationOTP,
    resendOtp,
    registerUser,
    loginUser ,
    logOutUser ,
    refreshAccessToken
 } from '../controllers/auth.controller.js';

const router = Router();

router.route("/register").post(registerUser);


router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT,logOutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/add-friend").post(verifyJWT, addFriend)

router.route("/remove-friend").delete(verifyJWT, removeFriend)

router.route("/get-friend-list").get(verifyJWT, getFriendsList)

router.route("/update-friend-profile").patch(verifyJWT, updateFriendProfile)

router.route("/add-user-details").post(verifyJWT, addUserDetails)

router.route("/send-otp").post(sendVerificationOTP);

router.route("/resend-otp").post(resendOtp);

router.route("/delete-account").post(verifyJWT,deleteAccount)

router.route("/fetch-all-friends").get(verifyJWT,fetchAllFriends)

export default router;