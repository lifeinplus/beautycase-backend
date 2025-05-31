import { TokenExpiredError } from "jsonwebtoken";

import Logging from "../../library/Logging";
import UserModel from "../../models/UserModel";
import type { RefreshResult, UserJwtPayload } from "../../types/auth";
import { UnauthorizedError } from "../../utils/AppErrors";
import {
    filterRefreshTokens,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "./TokenService";

export const refreshToken = async (
    existingRefreshToken: string
): Promise<RefreshResult> => {
    if (!existingRefreshToken) {
        throw new UnauthorizedError("Refresh token not found");
    }

    let foundUser = await UserModel.findOne({
        refreshTokens: existingRefreshToken,
    }).exec();

    if (!foundUser) {
        const decoded = verifyRefreshToken(existingRefreshToken);

        Logging.warn("Attempted refresh token reuse at /auth/refresh");

        const hackedUser = await UserModel.findOne({
            username: decoded.username,
        }).exec();

        if (hackedUser) {
            hackedUser.refreshTokens = [];
            await hackedUser.save();
        }

        throw new UnauthorizedError("Refresh token reuse detected");
    }

    let decoded: UserJwtPayload;
    let refreshTokenArray: string[] = [];

    try {
        decoded = verifyRefreshToken(existingRefreshToken);
    } catch (error) {
        if (foundUser && error instanceof TokenExpiredError) {
            refreshTokenArray = filterRefreshTokens(
                foundUser.refreshTokens,
                existingRefreshToken
            );

            foundUser.refreshTokens = [...refreshTokenArray];
            await foundUser.save();
        }

        throw error;
    }

    if (foundUser.username !== decoded.username) {
        throw new UnauthorizedError("Username incorrect");
    }

    const accessToken = signAccessToken({
        role: foundUser.role,
        userId: foundUser.id,
        username: foundUser.username,
    });

    const refreshToken = signRefreshToken(foundUser.username);

    refreshTokenArray = filterRefreshTokens(
        foundUser.refreshTokens,
        existingRefreshToken
    );

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
