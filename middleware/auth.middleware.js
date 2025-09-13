import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

// Middleware to protect routes
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user info to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
