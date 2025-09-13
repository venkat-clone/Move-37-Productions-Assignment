import express from 'express';
import userRouter from './user.route.js';
import pollRouter from './poll.route.js';
import authRouter from './auth.route.js';
const router = express.Router();

router.use('/user',userRouter);
router.use('/poll',pollRouter);
router.use('/auth',authRouter);


export default router;