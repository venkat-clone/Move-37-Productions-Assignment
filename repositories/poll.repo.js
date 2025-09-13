import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const pollRepo = {
    create: async ({ creatorId, options,...data}) => {
        return prisma.poll.create({
            data: {
                ...data,
                creator: {connect: {id: creatorId}},
                options: {create: options},
            }
        });
    },

    findById: async (id) => {
        return prisma.poll.findUnique({
            where: {id},
            include: {
                options: {
                    include: {votes: true},
                },
                creator: {
                    omit: {passwordHash: true},
                },
            },
        });
    },

    findAll: async ({pageNo, pageSize, query, sortOrder}) => {
        const skip = (pageNo - 1) * pageSize;

        const where = query
            ? {
                question: {
                    contains: query,
                    mode: 'insensitive',
                },
            }
            : {};

        const [polls, totalCount] = await Promise.all([
            prisma.poll.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    createdAt: sortOrder || 'desc',
                },
            }),
            prisma.poll.count({where}),
        ]);

        return {
            polls,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: pageNo,
        };
    },

    update: async (id, data) => {
        return prisma.poll.update({
            where: {id},
            data,
        });
    },

    delete: async (id) => {
        return prisma.poll.delete({
            where: {id},
        });
    },

    findByCreator: async (creatorId) => {
        return prisma.poll.findMany({
            where: {creatorId},
            orderBy: {createdAt: 'desc'},
        });
    },
};

export default pollRepo;
