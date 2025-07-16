import Router from 'express';
import { fetchAndStoreLeetcodeContests } from "../controllers/contestantStanding.controller.js";
import { verifyJWT}  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/populate-contest-standings").post(verifyJWT, fetchAndStoreLeetcodeContests);

export default router;