import {Prisma} from "@prisma/client";
import logger from "./logger.js";

// Format Zod errors to user-friendly structure
export const formatZodError = (validationResult) => {
    const userFriendlyErrors = {};
    validationResult.error.issues.forEach((error) => {
        error.path.forEach((path) => {
            userFriendlyErrors[path] = error.message;
        });
    });

    logger.warn("Zod validation failed", {
        errors: userFriendlyErrors,
    });

    return userFriendlyErrors;
};

// Zod validator middleware for Express
export const validateRequest = (schema) => (req, res, next) => {
    const validationResult = schema.safeParse(req.body || {});

    if (!validationResult.success) {

        const userFriendlyErrors = formatZodError(validationResult);
        logger.warn("Validation middleware error", {
            body: req.body,
            errors: userFriendlyErrors,
        });
        return res.status(400).json({error: userFriendlyErrors});
    }

    req.zBody = validationResult.data;
    next();
};

// Translate Prisma error codes into human-friendly messages
export const getPrismaErrorMessage = (error) => {
    logger.error(`[PrismaErrorHandler] Error caught`, {
        code: error.code,
        message: error.message,
        meta: error.meta,
    });

    const errorMessages = {
        P2002: {message: "Record already exists", statusCode: 400},
        P2003: {message: "Record does not exist", statusCode: 400},
        P2025: {message: "Record not found", statusCode: 404},
        P2017: {message: "Missing related record", statusCode: 400},
        P2018: {message: "Required record was not found", statusCode: 404},
        P2016: {message: "Query interpretation error", statusCode: 400},
        P2014: {message: "Nested connect or create failed", statusCode: 400},
        P2021: {message: "Table or column not found in database", statusCode: 500},
        P2022: {message: "Column missing in database", statusCode: 500},
        P2023: {message: "Inconsistent database state", statusCode: 500},
        P2034: {message: "Transaction failed due to conflict", statusCode: 409},
        P3000: {message: "Database connection error", statusCode: 500},
        P3001: {message: "Database operation timeout", statusCode: 500},
        P3002: {message: "Invalid database credentials", statusCode: 500},
        P4000: {message: "Invalid Prisma schema detected", statusCode: 500},
        P5000: {message: "Invalid input provided", statusCode: 400},
    };

    if (error.code && errorMessages[error.code]) {
        return {
            message: errorMessages[error.code].message,
            statusCode: errorMessages[error.code].statusCode,
        };
    }

    return {
        message: error.message,
        statusCode: 500,
    };
};

// Middleware to handle Prisma errors
export const prismaErrorHandler = (error, req, res, next) => {
    logger.error("Prisma Error", {
        name: error.name,
        code: error.code,
        meta: error.meta,
        message: error.message,
    });

    const isPrismaError =
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientValidationError;

    if (!isPrismaError) {
        return next(error);
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            success: false,
            message: "Invalid data format.",
            meta: error,
        });
    }

    const {message, statusCode} = getPrismaErrorMessage(error);
    return res.status(statusCode).json({
        success: false,
        message,
        meta: error.meta,
    });
};

// Catch-all error handler for uncaught errors
export const globalErrorHandler = (error, req, res, next) => {
    logger.debug("Error", {
        message: error.message,
        stack: error?.stack,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        query: req.query,
    })
    logger.error("Unhandled Error", {
        message: error.message,
        stack: (error.stack||""),
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        query: req.query,
    });


    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({message: "Invalid JSON payload"});
    }

    res.status(500).json({
        error: error.message || "Internal Server Error",
    });
};
