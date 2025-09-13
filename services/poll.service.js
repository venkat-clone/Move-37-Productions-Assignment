import pollRepo from "../repositories/poll.repo.js";
import { pollSchema } from "../schemas/poll.schema.js";
import logger from "../utils/logger.js";

export const createPoll = async (pollData) => {
    logger.debug("createPoll called", { pollData });

    const newPoll = await pollRepo.create(pollData);

    logger.info(`Poll created with ID: ${newPoll.id} by creator ${pollData.creatorId}`);

    return newPoll;
};

export const getPollById = async (pollId) => {
    logger.debug(`getPollById called with pollId: ${pollId}`);

    const poll = await pollRepo.findById(pollId);

    if (!poll) {
        logger.warn(`Poll not found with ID: ${pollId}`);
        throw new Error("Poll not found");
    }

    const optionsWithVoteCount = poll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes.length,
    }));

    logger.debug(`Poll retrieved with ID: ${pollId}`);

    return {
        ...poll,
        options: optionsWithVoteCount,
    };
};

export const listPolls = async (paginationOptions) => {
    logger.debug("listPolls called", { paginationOptions });

    const result = await pollRepo.findAll(paginationOptions);
    logger.info(`Retrieved ${result.length} polls`);
    return result;
};

export const updatePoll = async (pollId, updateData) => {
    logger.debug("updatePoll called", { pollId, updateData });

    const allowedUpdateSchema = pollSchema.pick({
        question: true,
        isPublished: true,
    }).partial();

    const validData = allowedUpdateSchema.parse(updateData);

    logger.debug("Validated update data", { validData });

    const existingPoll = await pollRepo.findById(pollId);

    if (!existingPoll) {
        logger.warn(`Poll not found with ID: ${pollId}`);
        throw new Error("Poll not found");
    }

    if (existingPoll.creatorId !== updateData.creatorId) {
        logger.warn(`Unauthorized update attempt by creator ${updateData.creatorId} on poll ${pollId}`);
        throw new Error("Unauthorized to update this poll");
    }

    if (existingPoll.isPublished) {
        logger.warn(`Update attempt on published poll ID: ${pollId}`);
        throw new Error("Cannot update a published poll");
    }

    const updatedPoll = await pollRepo.update(pollId, validData);

    logger.info(`Poll updated with ID: ${pollId}`);

    return updatedPoll;
};

export const deletePoll = async (pollId) => {
    logger.debug(`deletePoll called with pollId: ${pollId}`);

    await pollRepo.delete(pollId);

    logger.info(`Poll deleted with ID: ${pollId}`);
};

export const getPollsByCreator = async (creatorId) => {
    logger.debug(`getPollsByCreator called for creatorId: ${creatorId}`);

    const polls = await pollRepo.findByCreator(creatorId);

    logger.info(`Retrieved ${polls.length} polls for creatorId: ${creatorId}`);

    return polls;
};
