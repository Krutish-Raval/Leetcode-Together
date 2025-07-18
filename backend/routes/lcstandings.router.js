import Router from 'express';
import { fetchAndStoreLeetcodeContests,getContestData,getFriendsContestPerformance  } from "../controllers/contestantStanding.controller.js";
import { fetchAndStoreLCCNContests,getFriendsLCCNPerformance } from "../controllers/lccnInfo.controller.js";
import { verifyJWT}  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/populate-contest-standings").post(verifyJWT, fetchAndStoreLeetcodeContests);

router.route("/lccn-contests-populate").post(verifyJWT, fetchAndStoreLCCNContests);

router.route("/friends-contest-lc-details").post(verifyJWT, getFriendsContestPerformance);

router.route("/friends-contest-lccn-details").post(verifyJWT, getFriendsLCCNPerformance);

router.route("/contest-metadata").get(verifyJWT,getContestData);

export default router;