import Router from 'express';
import { populateContestStandings } from "../controllers/contestantStanding.controller.js";
import { verifyJWT}  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/populate-contest-standings").post(verifyJWT, populateContestStandings);

export default router;