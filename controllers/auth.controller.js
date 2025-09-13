import * as authService from "../services/auth.service.js";



// POST /api/users/register
export const register = async (req, res, next) => {
    if(!req.body){
        throw Error("Invalid Request");
    }
    const user = await authService.createUser(req.body);
    res.status(201).json(user);

};

// POST /api/users/login
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const data = await authService.loginUser(email, password);
    res.json(data);
};
