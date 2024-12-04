import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

import { UserModel } from "../../models";
import { ConflictError } from "../../utils";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { username, password } = req.body;

    try {
        const foundUser = await UserModel.findOne({ username }).exec();

        if (foundUser) {
            throw new ConflictError("Username already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            creationDate: new Date(),
            password: hashedPassword,
            username,
        });

        res.status(201).json({ message: `Account created successfully` });
    } catch (error) {
        next(error);
    }
};
