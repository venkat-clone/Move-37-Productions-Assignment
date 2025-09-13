import dotenv from "dotenv";
dotenv.config();

// Environment variables
export const ENV = process.env.NODE_ENV || 'development';
export const isProduction = ENV === 'production';
export const PORT = parseInt(process.env.PORT, 10) || 3000;
export const loggingLevel = isProduction ? 'info' : 'debug';
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

// JWT settings
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Fail fast if insecure config in production
if (isProduction && JWT_SECRET === "your_jwt_secret") {
  throw new Error("❌ JWT_SECRET must be set in production environment.");
}
