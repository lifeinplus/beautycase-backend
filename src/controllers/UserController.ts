import { NextFunction, Request, Response } from "express";

import { MakeupBagModel, UserModel } from "../models";
import { NotFoundError } from "../utils";

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id).select("role username");
        const makeupBags = await MakeupBagModel.find({ clientId: id })
            .select("categoryId")
            .populate("categoryId", "name");

        if (!user) {
            throw new NotFoundError("User not found");
        }

        res.status(200).json({ user, makeupBags });
    } catch (error) {
        next(error);
    }
};

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
