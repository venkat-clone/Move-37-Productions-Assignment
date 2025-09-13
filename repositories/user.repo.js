import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const userRepo = {

    create: async (userData) => {
        return prisma.user.create({
            data: userData,
            omit: { passwordHash: true }
        });
    },

    // Find a user by email
    findByEmail: async (email, includePassword = false) => {
        return prisma.user.findUnique({
            where: { email },
            omit:{ passwordHash: !includePassword },
        });
    },


    findById: async (id, includePassword = false) => {
        return prisma.user.findUnique({
            where: { id },
            omit:{ passwordHash: !includePassword },
        });
    },

    // Get all users with pagination, search, and sorting
    findAll: async ({ pageNo, pageSize, query, sortOrder }) => {
        const skip = (pageNo - 1) * pageSize;

        const where = query
            ? {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            }
            : {};

        const [users, totalCount] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    name: sortOrder,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            users,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: pageNo,
        };
    },

    update: async (id, data) => {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
    },

    delete: async (id) => {
        return prisma.user.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
    },
};

export default userRepo;
