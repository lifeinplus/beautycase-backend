import bcrypt from "bcrypt";
import { Request, Response } from "express";

import config from "../../config";
import Logging from "../../library/Logging";
import { UserModel } from "../../models";

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // if (!username) {
    //     res.status(400).json({ message: `All user data is required` });
    //     return;
    // }

    // if (
    //     !password ||
    //     password.length < config.auth.passwordLengthMin ||
    //     !confirmPassword ||
    //     confirmPassword.length < config.auth.passwordLengthMin
    // ) {
    //     res.status(400).json({
    //         message: `Passwords are required and should be at least ${config.auth.passwordLengthMin} characters long`,
    //     });
    //     return;
    // }

    // if (password !== confirmPassword) {
    //     res.status(400).json({ message: `Passwords do not match` });
    //     return;
    // }

    try {
        const foundUser = await UserModel.findOne({ username }).exec();

        if (foundUser) {
            res.status(409).json({ message: `Username already in use` });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            creationDate: new Date(),
            password: hashedPassword,
            username,
        });

        res.status(201).json({ message: `Account created successfully` });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
            return;
        }

        res.status(500).json({ error });
    }
};
