import { NextFunction, Request, Response } from "express";

import { UserModel } from "../../models";

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const cookies = req.cookies;

    if (!cookies.jwt) {
        res.sendStatus(204);
        return;
    }

    res.clearCookie("jwt");

    try {
        const foundUser = await UserModel.findOne({
            refreshTokens: cookies.jwt,
        }).exec();

        if (foundUser) {
            foundUser.refreshTokens = foundUser.refreshTokens.filter(
                (token) => token !== cookies.jwt
            );

            await foundUser.save();
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};
