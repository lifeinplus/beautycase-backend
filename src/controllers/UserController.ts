import { NextFunction, Request, Response } from "express";

import { UserModel } from "../models";
import { NotFoundError } from "../utils";

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await UserModel.find().select("_id username");

        if (!users.length) {
            throw new NotFoundError("Users not found");
        }

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};
