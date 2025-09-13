import * as userService from "../services/user.service.js";
import paginationSchema from "../schemas/pagination.schema.js";

// GET /api/users
export const getUsers = async (req, res, next) => {
    const pagination = paginationSchema.parse(req.query);
    const data = await userService.getAllUsers(pagination);
    res.json(data);
};

// GET /api/users/:id
export const getUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await userService.getUserById(parseInt(id));
    res.json(user);
};

// PUT /api/users/:id
export const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const updateData = req.body;
    const updatedUser = await userService.updateUser(id, updateData);
    res.json(updatedUser);
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const deletedUser = await userService.deleteUser(id);
    res.json(deletedUser);
};
