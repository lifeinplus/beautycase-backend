import bcrypt from "bcrypt";

import Logging from "../../library/Logging";
import UserModel from "../../models/UserModel";
import type { LoginCredentials, LoginResult } from "../../types/auth";
import { UnauthorizedError } from "../../utils/AppErrors";
import {
    filterRefreshTokens,
    signAccessToken,
    signRefreshToken,
} from "./TokenService";

export const loginUser = async (
    credentials: LoginCredentials,
    existingRefreshToken?: string
): Promise<LoginResult> => {
    const foundUser = await UserModel.findOne({
        username: credentials.username,
    }).exec();

    if (!foundUser) {
        throw new UnauthorizedError("Username or password is incorrect");
    }

    const isMatch = await bcrypt.compare(
        credentials.password,
        foundUser.password
    );

    if (!isMatch) {
        throw new UnauthorizedError("Username or password is incorrect");
    }

    const accessToken = signAccessToken({
        role: foundUser.role,
        userId: foundUser.id,
        username: foundUser.username,
    });

    const refreshToken = signRefreshToken(foundUser.username);

    let refreshTokenArray = filterRefreshTokens(
        foundUser.refreshTokens,
        existingRefreshToken
    );

    if (existingRefreshToken) {
        // Scenario:
        // 1. User logins, never uses RT, doesn't logout
        // 2. RT is stolen
        // 3. Clear all RTs when user logins
        const foundToken = await UserModel.findOne({
            refreshTokens: existingRefreshToken,
        }).exec();

        if (!foundToken) {
            Logging.warn("Attempted refresh token reuse at /auth/login");
            refreshTokenArray = [];
        }
    }

    foundUser.refreshTokens = [...refreshTokenArray, refreshToken];
    await foundUser.save();

    return {
        accessToken,
        refreshToken,
        user: {
            role: foundUser.role,
            userId: foundUser.id,
            username: foundUser.username,
        },
    };
};
