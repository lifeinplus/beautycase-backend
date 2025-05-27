import { NextFunction, Request, Response } from "express";

import config from "../../config";
import * as AuthService from "../../services/AuthService";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { username, password } = req.body;
    const refreshToken = req.cookies.jwt;

    try {
        const loginResult = await AuthService.login(
            { username, password },
            refreshToken
        );

        if (refreshToken) {
            res.clearCookie("jwt");
        }

        res.status(200)
            .cookie("jwt", loginResult.refreshToken, config.auth.cookieOptions)
            .json({
                accessToken: loginResult.accessToken,
                role: loginResult.user.role,
                userId: loginResult.user.userId,
                username: loginResult.user.username,
            });
    } catch (error) {
        next(error);
    }
};
