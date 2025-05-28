import { NextFunction, Request, Response } from "express";

import * as RegisterService from "../../services/auth/RegisterService";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { username, password } = req.body;

    try {
        await RegisterService.register({ username, password });
        res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        next(error);
    }
};
