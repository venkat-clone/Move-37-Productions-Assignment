import userRepo from "../repositories/user.repo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    SALT_ROUNDS,
    JWT_SECRET,
    JWT_EXPIRES_IN
} from "../config/env.js";
import { userSchema } from "../schemas/user.schema.js";
import logger from "../utils/logger.js";

export const createUser = async (user) => {
    logger.debug("createUser called", { email: user?.email });

    const { name, email, password } = userSchema.parse(user);
    logger.debug("User data validated", { email });

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
        logger.warn(`User creation failed: Email already registered - ${email}`);
        throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    logger.debug("Password hashed successfully");

    const newUser = await userRepo.create({ name, email, passwordHash });

    logger.info(`User created with ID: ${newUser.id}, email: ${email}`);

    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    };
};

// Login user with JWT
export const loginUser = async (email, password) => {
    logger.debug("loginUser called", { email });

    const user = await userRepo.findByEmail(email, true);

    if (!user) {
        logger.warn(`Login failed: Email not found - ${email}`);
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        logger.warn(`Login failed: Invalid password for email - ${email}`);
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`User logged in successfully: ${email}`);

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
};
