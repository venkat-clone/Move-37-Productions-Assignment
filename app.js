import express from 'express';
import morgan from 'morgan';
import logger from './utils/logger.js';
import {ENV, isProduction, loggingLevel, PORT} from './config/env.js';
import cors from 'cors';
import router from './routes/index.route.js'
import {globalErrorHandler, prismaErrorHandler} from "./utils/utils.js"
import * as http from "node:http";
import { setupWebSocketServer } from './websocket/index.js';
const app = express();
const server = http.createServer(app);
setupWebSocketServer(server);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.http(`${req.ip} "${req.method} ${req.originalUrl} HTTP/${req.httpVersion}"`);
    next();
});


app.use('/api',router);

app.use(prismaErrorHandler);
app.use(globalErrorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).send('Route not found');
});

server.listen(PORT, () => {
    logger.info(`Logging level: ${loggingLevel}`);
    logger.info(`project env: ${ENV}`);
    logger.info(`project Production: ${isProduction}`);
    logger.debug("Server started");
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
})
