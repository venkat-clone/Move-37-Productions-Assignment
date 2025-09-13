import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const voteRepo = {
    create: async (voteData) => {
        return prisma.vote.create({ data: voteData });
    },

    hasUserVoted: async (userId, optionId) => {
        return prisma.vote.findUnique({
            where: {
                userId_optionId: {
                    userId,
                    optionId,
                },
            },
        });
    },

    countVotesForOption: async (optionId) => {
        return prisma.vote.count({
            where: { optionId },
        });
    },

    getVotesByUser: async (userId) => {
        return prisma.vote.findMany({
            where: { userId },
            include: {
                option: true,
            },
        });
    },

    delete: async (id) => {
        return prisma.vote.delete({
            where: { id },
        });
    },



};

export default voteRepo;
