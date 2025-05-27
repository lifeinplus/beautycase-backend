import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import config from "../config";
import Logging from "../library/Logging";
import UserModel from "../models/UserModel";
import type {
    AuthUser,
    LoginCredentials,
    LoginResult,
    RefreshResult,
    UserJwtPayload,
} from "../types/auth";
import { UnauthorizedError } from "../utils/AppErrors";

const filterRefreshTokens = (
    existingTokens: string[],
    tokenToRemove?: string
): string[] => {
    return existingTokens.filter((token) => token !== tokenToRemove);
};

const signAccessToken = (user: AuthUser): string => {
    const { role, userId, username } = user;
    return jwt.sign(
        { role, userId, username },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
};

const signRefreshToken = (username: string): string => {
    return jwt.sign(
        { username },
        config.auth.refreshToken.secret,
        config.auth.refreshToken.options
    );
};

const verifyRefreshToken = (token: string): UserJwtPayload => {
    return jwt.verify(token, config.auth.refreshToken.secret) as UserJwtPayload;
};

export const login = async (
    credentials: LoginCredentials,
    existingRefreshToken?: string
): Promise<LoginResult> => {
    const foundUser = await UserModel.findOne({
        username: credentials.username,
    }).exec();

    if (!foundUser) {
        throw new UnauthorizedError("User not found");
    }

    const isMatch = await bcrypt.compare(
        credentials.password,
        foundUser.password
    );

    if (!isMatch) {
        throw new UnauthorizedError("Password is incorrect");
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

export const logout = async (
    existingRefreshToken: string
): Promise<boolean> => {
    const foundUser = await UserModel.findOne({
        refreshTokens: existingRefreshToken,
    }).exec();

    if (!foundUser) {
        return false;
    }

    foundUser.refreshTokens = filterRefreshTokens(
        foundUser.refreshTokens,
        existingRefreshToken
    );

    await foundUser.save();

    return true;
};

export const refresh = async (
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
