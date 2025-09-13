import express from 'express';
import { register,login } from "../controllers/auth.controller.js";
import { validateRequest } from '../utils/utils.js';
import {loginSchema, userSchema} from '../schemas/user.schema.js';
const router = express.Router();


router.post("/register",validateRequest(userSchema), register);
router.post("/login",validateRequest(loginSchema), login);

export default router;