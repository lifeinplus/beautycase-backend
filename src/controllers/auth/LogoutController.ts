import { NextFunction, Request, Response } from "express";

import * as LogoutService from "../../services/auth/LogoutService";

export const logoutUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
        res.sendStatus(204);
        return;
    }

    res.clearCookie("jwt");

    try {
        await LogoutService.logoutUser(refreshToken);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};
