import { NextFunction, Request, Response } from "express";

import * as UserService from "../services/UserService";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const { user, makeupBags, lessons } = await UserService.getUserById(id);
        res.status(200).json({ user, makeupBags, lessons });
    } catch (error) {
        next(error);
    }
};
