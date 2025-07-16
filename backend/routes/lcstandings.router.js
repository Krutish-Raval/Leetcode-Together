import Router from 'express';
import { fetchAndStoreLeetcodeContests } from "../controllers/contestantStanding.controller.js";
import { fetchAndStoreLCCNContests } from "../controllers/lccnInfo.controller.js";
import { verifyJWT}  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/populate-contest-standings").post(verifyJWT, fetchAndStoreLeetcodeContests);
router.route("/lccn-contests-populate").post(verifyJWT, fetchAndStoreLCCNContests);
export default router;