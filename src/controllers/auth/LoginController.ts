import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../../config";
import Logging from "../../library/Logging";
import UserModel from "../../models/UserModel";
import { UnauthorizedError } from "../../utils/AppErrors";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { username: reqUsername, password: reqPassword } = req.body;

    const cookies = req.cookies;

    try {
        const foundUser = await UserModel.findOne({
            username: reqUsername,
        }).exec();

        if (!foundUser) {
            throw new UnauthorizedError("User not found");
        }

        const {
            _id: userId,
            password,
            refreshTokens,
            role,
            username,
        } = foundUser;

        const isMatch = await bcrypt.compare(reqPassword, password);

        if (!isMatch) {
            throw new UnauthorizedError("Password is incorrect");
        }

        const newAccessToken = jwt.sign(
            { role, userId, username },
            config.auth.accessToken.secret,
            config.auth.accessToken.options
        );

        const newRefreshToken = jwt.sign(
            { username },
            config.auth.refreshToken.secret,
            config.auth.refreshToken.options
        );

        let refreshTokenArray = refreshTokens.filter(
            (token) => token !== cookies.jwt
        );

        if (cookies.jwt) {
            // Scenario:
            // 1. User logins, never uses RT, doesn't logout
            // 2. RT is stolen
            // 3. Clear all RTs when user logins
            const foundToken = await UserModel.findOne({
                refreshTokens: cookies.jwt,
            }).exec();

            if (!foundToken) {
                Logging.warn("Attempted refresh token reuse at /auth/login");
                refreshTokenArray = [];
            }

            res.clearCookie("jwt");
        }

        foundUser.refreshTokens = [...refreshTokenArray, newRefreshToken];
        await foundUser.save();

        res.status(200)
            .cookie("jwt", newRefreshToken, config.auth.cookieOptions)
            .json({
                accessToken: newAccessToken,
                role,
                userId,
                username,
            });
    } catch (error) {
        next(error);
    }
};
