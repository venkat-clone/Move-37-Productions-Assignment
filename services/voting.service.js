import voteRepo from "../repositories/vote.repo.js";
import logger from "../utils/logger.js";
import pollRepo from "../repositories/poll.repo.js";
import { broadcastVoteCounts } from "../websocket/index.js";

export const castVote = async (pollId, userId, optionId) => {
    logger.debug("castVote called", { pollId, userId, optionId });

    const poll = await pollRepo.findById(pollId);
    if (!poll) {
        logger.warn(`Vote failed: Poll not found - pollId: ${pollId}`);
        throw new Error("Poll not found");
    }

    logger.debug("Poll found", { pollId, isPublished: poll.isPublished });

    // TODO: Confirm business logic on isPublished
    // if (poll.isPublished) {
    //     logger.warn(`Voting blocked: Poll is already published - pollId: ${pollId}`);
    //     throw new Error("Poll is published, cannot vote");
    // }

    const option = poll.options.find((opt) => opt.id === optionId);
    if (!option) {
        logger.warn(`Vote failed: Option not found - optionId: ${optionId} in pollId: ${pollId}`);
        throw new Error("Option not found");
    }

    const existingVote = await voteRepo.hasUserVoted(userId, optionId);
    if (existingVote) {
        logger.warn(`Vote rejected: User ${userId} has already voted for optionId: ${optionId}`);
        throw new Error("User has already voted for this option");
    }

    const newVote = await voteRepo.create({ userId, optionId });

    logger.info(`Vote cast: userId ${userId} voted for optionId ${optionId} in pollId ${pollId}`);

    broadcastVoteCounts(pollId);
    logger.debug(`Broadcast triggered for pollId: ${pollId}`);

    return newVote;
};
