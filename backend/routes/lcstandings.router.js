import Router from 'express';
import { fetchAndStoreLeetcodeContests,getFriendsContestPerformance  } from "../controllers/contestantStanding.controller.js";
import { fetchAndStoreLCCNContests,getFriendsLCCNPerformance } from "../controllers/lccnInfo.controller.js";
import { verifyJWT}  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/populate-contest-standings").post(verifyJWT, fetchAndStoreLeetcodeContests);

router.route("/lccn-contests-populate").post(verifyJWT, fetchAndStoreLCCNContests);

router.route("/friends-contest-lc-details").get(verifyJWT, getFriendsContestPerformance);

router.route("/friends-contest-lccn-details").get(verifyJWT, getFriendsLCCNPerformance);

export default router;