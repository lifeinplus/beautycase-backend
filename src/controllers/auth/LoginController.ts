import { NextFunction, Request, Response } from "express";

import config from "../../config";
import * as LoginService from "../../services/auth/LoginService";

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { username, password } = req.body;
    const refreshToken = req.cookies.jwt;

    try {
        const loginResult = await LoginService.loginUser(
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
