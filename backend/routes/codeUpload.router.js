import Router from 'express';

import {
    uploadSolution,
    editSolution,
    deleteSolution,
    getSolution
} from "../controllers/codeUploadedInStanding.controller.js"

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/upload-solution").post(verifyJWT,uploadSolution);

router.route("/get-solution").get(verifyJWT,getSolution);

router.route("/delete-solution").delete(verifyJWT,deleteSolution);

router.route("/edit-solution").patch(verifyJWT,editSolution);

export default router