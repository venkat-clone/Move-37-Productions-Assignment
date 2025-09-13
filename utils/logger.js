import path from "path";
import {fileURLToPath} from "url";
import {createLogger, format, transports} from "winston";
import {loggingLevel} from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const cleanStack = (stack) =>
    typeof stack === "string" ? stack.replace(/\n(?! )/g, "\\n") : String(stack);


const logFormatter = format.printf(({timestamp, level, message, ...meta}) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (meta.stack) {
        log += `\nTrace: ${cleanStack(meta.stack)}`;
        delete meta.stack;
    }

    if (level !== 'debug') {
        delete meta.body;
    }

    const metaString = Object.keys(meta).length
        ? `\n${JSON.stringify(meta, null, 4)}`
        : "";

    return `${log}${metaString}`;
});


const logger = createLogger({
    level: loggingLevel,
    format: format.combine(
        format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        logFormatter
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({format: "HH:mm:ss"}),
                format.printf(({timestamp, level, message, ...meta}) => {
                    let log = `${timestamp} [${level}]: ${message}`;
                    if (level !== 'debug') {
                        delete meta.body;
                    }
                    if (meta.stack) {
                        log += `\nTrace: ${cleanStack(meta.stack)}`;
                        delete meta.stack;
                    }
                    const metaString = Object.keys(meta).length
                        ? `\n${JSON.stringify(meta, null, 4)}`
                        : "";
                    return `${log}${metaString}`;
                })
            ),
        }),
        new transports.File({
            filename: path.join(__dirname, "..", "logs", "app.log"),
            level: "info",
        }),
        ...((loggingLevel === "debug") ? [new transports.File({
            filename: path.join(__dirname, "..", "logs", "debug.log"),
            level: "debug",

        }),] : []),
        new transports.File({
            filename: path.join(__dirname, "..", "logs", "error.log"),
            level: "error",
        }),
    ],
    exitOnError: false,
});


export default logger;
