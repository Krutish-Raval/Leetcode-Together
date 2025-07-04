import Router from 'express';
import { saveContestData, getUserContestPerformance } from "../controllers/contestantStanding.controller.js";
import { verifyJWT}  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/save-contest-data").post(verifyJWT, saveContestData);

router.route("/get-user-contest-performance").get(verifyJWT, getUserContestPerformance);

export default router;