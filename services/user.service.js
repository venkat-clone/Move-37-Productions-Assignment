import userRepo from "../repositories/user.repo.js";
import logger from "../utils/logger.js";
import {userSchema} from "../schemas/user.schema.js";


export const getAllUsers = async (paginationOptions) => {
    logger.debug("getAllUsers called", {paginationOptions});

    const result = await userRepo.findAll(paginationOptions);

    logger.info(`Retrieved ${result.users.length} users (page ${result.currentPage}/${result.totalPages})`);

    return result;
};


export const getUserById = async (id) => {
    logger.debug("getUserById called", {id});

    const user = await userRepo.findById(id);

    if (!user) {
        logger.warn(`User not found with ID: ${id}`);
        throw new Error("User not found");
    }

    logger.info(`User retrieved: ID ${id}`);
    return user;
};


export const updateUser = async (id, updateData) => {
    logger.debug("updateUser called", {id, updateData});


    const allowedUpdateSchema = userSchema.pick({
        name: true,
        email: true,
    }).partial();

    const validData = allowedUpdateSchema.parse(updateData);
    logger.debug("Update data validated", {validData});

    const existingUser = await userRepo.findById(id);
    if (!existingUser) {
        logger.warn(`Update failed: User not found - ID: ${id}`);
        throw new Error("User not found");
    }

    const updatedUser = await userRepo.update(id, validData);

    logger.info(`User updated successfully - ID: ${id}`);

    return updatedUser;
};


export const deleteUser = async (id) => {
    logger.debug("deleteUser called", {id});

    const existingUser = await userRepo.findById(id);
    if (!existingUser) {
        logger.warn(`Delete failed: User not found - ID: ${id}`);
        throw new Error("User not found");
    }

    const deletedUser = await userRepo.delete(id);

    logger.info(`User deleted: ID ${id}, email: ${deletedUser.email}`);

    return deletedUser;
};
