import { NextFunction, Request, Response } from "express";

import config from "../../config";
import * as AuthService from "../../services/AuthService";

export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const refreshToken = req.cookies.jwt;

    try {
        if (refreshToken) {
            res.clearCookie("jwt");
        }

        const refreshResult = await AuthService.refresh(refreshToken);

        res.status(200)
            .cookie(
                "jwt",
                refreshResult.refreshToken,
                config.auth.cookieOptions
            )
            .json({
                accessToken: refreshResult.accessToken,
                role: refreshResult.user.role,
                userId: refreshResult.user.userId,
                username: refreshResult.user.username,
            });
    } catch (error) {
        next(error);
    }
};
