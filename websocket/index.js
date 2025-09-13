import { Server } from 'socket.io';
import { getPollById } from "../services/poll.service.js";
import logger from "../utils/logger.js";

let io = null;

/// TODO : Not mutationed In the Assignment to Use the redis
/// TODO : Conform with business logic
const pollIntervals = new Map();

export const setupWebSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.on('connection', (socket) => {
        logger.info(`Client connected: ${socket.id}`);

        socket.on('subscribe', async ({ pollId }) => {
            try {
                const poll = await getPollById(parseInt(pollId));
                socket.join(poll.id);

                const pastData = pollIntervals.get(poll.id);
                if (!pastData) {
                    logger.debug(`No cached data for poll ${poll.id}, broadcasting vote counts.`);
                    broadcastVoteCounts(poll.id);
                } else {
                    logger.debug(`Sending cached vote data for poll ${poll.id} to client ${socket.id}`);
                    io.to(pollId).emit('vote_update', pastData);
                }
                logger.info(`Client ${socket.id} subscribed to poll ${pollId}`);
            } catch (e) {
                if (e.message === "Poll not found") {
                    logger.warn(`Poll not found for subscription attempt by client ${socket.id} for poll ${pollId}`);
                    socket.emit('vote_update', {
                        message: 'Poll not found',
                        pollId
                    });
                } else {
                    logger.error(`Error subscribing client ${socket.id} to poll ${pollId}: ${e.message}`, { error: e });
                    socket.emit('error', {
                        type: 'SERVER_ERROR',
                        message: 'An unexpected error occurred while subscribing to the poll.',
                    });
                }
            }
        });

        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });
};

export const broadcastVoteCounts = (pollId) => {
    if (io) {
        getPollById(pollId).then((poll) => {
            io.to(pollId).emit('vote_update', poll);
            pollIntervals.set(pollId, poll);
            logger.debug(`Broadcasted vote counts for poll ${pollId}`);
        }).catch((e) => {
            logger.error(`Failed to broadcast vote counts for poll ${pollId}: ${e.message}`, { error: e });
        });
    }
};
