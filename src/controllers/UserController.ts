import { NextFunction, Request, Response } from "express";

import * as UserService from "../services/UserService";

export const readUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const { user, makeupBags } = await UserService.readUserWithMakeupBags(
            id
        );

        res.status(200).json({ user, makeupBags });
    } catch (error) {
        next(error);
    }
};

export const readUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await UserService.readUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};
