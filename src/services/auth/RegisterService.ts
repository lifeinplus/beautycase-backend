import bcrypt from "bcrypt";

import UserModel from "../../models/UserModel";
import type { RegisterCredentials } from "../../types/auth";
import { ConflictError } from "../../utils/AppErrors";

export const registerUser = async (credentials: RegisterCredentials) => {
    const { username, password, role = "client" } = credentials;

    const foundUser = await UserModel.findOne({ username }).exec();

    if (foundUser) {
        throw new ConflictError("Username already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
        username,
        password: hashedPassword,
        role,
    });
};
