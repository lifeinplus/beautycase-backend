import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import config from "../../config";
import { Logging } from "../../library/Logging";
import { UserModel } from "../../models";
import { UserJwtPayload } from "../../types";
import { UnauthorizedError } from "../../utils";

export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const cookies = req.cookies;

    let foundUser;
    let refreshTokenArray: string[] = [];

    try {
        if (!cookies.jwt) {
            throw new UnauthorizedError("Refresh token not found");
        }

        res.clearCookie("jwt");

        foundUser = await UserModel.findOne({
            refreshTokens: cookies.jwt,
        }).exec();

        if (!foundUser) {
            const decoded = jwt.verify(
                cookies.jwt,
                config.auth.refreshToken.secret
            ) as UserJwtPayload;

            Logging.warn("Attempted refresh token reuse at /auth/refresh");

            const hackedUser = await UserModel.findOne({
                username: decoded.username,
            }).exec();

            if (hackedUser) {
                hackedUser.refreshTokens = [];
                await hackedUser.save();
            }

            throw new UnauthorizedError();
        }

        const { _id: userId, refreshTokens, role, username } = foundUser;

        const decoded = jwt.verify(
            cookies.jwt,
            config.auth.refreshToken.secret
        ) as UserJwtPayload;

        if (username !== decoded.username) {
            throw new UnauthorizedError("Username incorrect");
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

        refreshTokenArray = refreshTokens.filter(
            (token) => token !== cookies.jwt
        );

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
        if (error instanceof TokenExpiredError) {
            if (foundUser) {
                foundUser.refreshTokens = [...refreshTokenArray];
                await foundUser.save();
            }
        }

        next(error);
    }
};
