import * as pollService from "../services/poll.service.js";
import paginationSchema from "../schemas/pagination.schema.js";
import * as votingService from "../services/voting.service.js";

// POST /api/polls
export const createPoll = async (req, res) => {
    if (!req.body) {
        throw new Error("Invalid request: no data provided");
    }

    const newPoll = await pollService.createPoll({...req.zBody, creatorId: req.user.id});
    res.status(201).json(newPoll);
};

// GET /api/polls/:id
export const getPollById = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        throw new Error("Poll ID is required");
    }

    const poll = await pollService.getPollById(parseInt(id));
    res.json(poll);
};

// GET /api/polls? pageNo & pageSize & query & sortOrder
export const listPolls = async (req, res) => {
    const paginationParams = paginationSchema.parse(req.query);


    const polls = await pollService.listPolls(paginationParams);
    res.json(polls);
};

// PUT /api/polls/:id
export const updatePoll = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        throw new Error("Poll ID is required");
    }

    if (!req.body) {
        throw new Error("No update data provided");
    }


    const updatedPoll = await pollService.updatePoll(parseInt(id), {...req.body, creatorId: req.user.id});

    res.json(updatedPoll);
};

// DELETE /api/polls/:id
export const deletePoll = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        throw new Error("Poll ID is required");
    }

    await pollService.deletePoll(parseInt(id));

    res.status(204).send();
};

// GET /api/polls/creator/:creatorId
export const getPollsByCreator = async (req, res) => {
    const {creatorId} = req.params;

    if (!creatorId) {
        throw new Error("Creator ID is required");
    }

    const polls = await pollService.getPollsByCreator(parseInt(creatorId));

    res.json(polls);
};

// PUT /api/polls/castVote/:pollId/:optionId
export const castVote = async (req, res) => {
    const {pollId, optionId} = req.params;

    if (!pollId || !optionId) {
        throw new Error("Poll ID and option ID are required");
    }

    await votingService.castVote(parseInt(pollId), req.user.id, parseInt(optionId));

    res.status(204).send();

}
