import { Router } from "express";

import{
    postSolution,
    getSolutionPosts,
    deleteSolutionPost,
    editSolution
} from '../controllers/solutionPost.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/post-solution").post(verifyJWT, postSolution);

router.route("/get-solution-posts").get(verifyJWT, getSolutionPosts);

router.route("/delete-solution-post").delete(verifyJWT, deleteSolutionPost);

router.route("/edit-solution").patch(verifyJWT,editSolution);



export default router;