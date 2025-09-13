import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pollOptionRepo = {
    create: async (optionData) => {
        return prisma.pollOption.create({ data: optionData });
    },

    findById: async (id) => {
        return prisma.pollOption.findUnique({
            where: { id },
            include: {
                poll: true,
                votes: true,
            },
        });
    },

    findByPollId: async (pollId) => {
        return prisma.pollOption.findMany({
            where: { pollId },
            include: {
                votes: true,
            },
        });
    },

    delete: async (id) => {
        return prisma.pollOption.delete({
            where: { id },
        });
    },
};

export default pollOptionRepo;
