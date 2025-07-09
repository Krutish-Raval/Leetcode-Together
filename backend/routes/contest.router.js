import Router from 'express';
import {
    getAllContests,
    removeContest,
    addContest,
    populateContests,
    removeOldContests
} from "../controllers/contestAdd.controller.js"
import { verifyJWT}  from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/add-contest").post(verifyJWT,addContest)

router.route("/remove-contest").delete(verifyJWT,removeContest)

router.route("/get-all-contest").get(verifyJWT,getAllContests)

router.route("/populate-all-contest").post(verifyJWT,populateContests)

router.route("/remove-old-contests").delete(verifyJWT,removeOldContests)

export default router