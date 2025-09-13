import express from 'express';
import {deleteUser, getUser, getUsers, updateUser} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/list", getUsers);
router.get("/id/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;