import { NextFunction, Request, Response } from "express";
import * as AuthService from "../../services/AuthService";

export const logout = async (
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
        await AuthService.logout(refreshToken);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};
