import express from 'express';
import {
    castVote,
    createPoll,
    deletePoll,
    getPollById,
    getPollsByCreator,
    listPolls,
    updatePoll
} from "../controllers/poll.controller.js";
import {validateRequest} from "../utils/utils.js";
import {pollSchema} from "../schemas/poll.schema.js";
import {authenticate} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/list", listPolls);
router.get("/id/:id", getPollById);
router.get("/creator/:creatorId", getPollsByCreator);
router.post("/create",authenticate,validateRequest(pollSchema), createPoll);
router.put("/update/:id",authenticate, updatePoll);
router.delete("/delete/:id",authenticate, deletePoll);

router.put("/castVote/:pollId/:optionId",authenticate, castVote);



export default router;