import Router from "express";
import { 
  sendVerificationOTP, verifyEmail, 
  sendPasswordResetOTP, resetPassword 
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/send-verification-otp").post(verifyJWT,sendVerificationOTP);

router.route("/verify-email").post(verifyJWT, verifyEmail);

router.route("/send-reset-otp").post(sendPasswordResetOTP);

router.route("/reset-password").post(resetPassword);


export default router;