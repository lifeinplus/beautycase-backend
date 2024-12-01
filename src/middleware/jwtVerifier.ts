import { NextFunction, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import config from "../config";
import Logging from "../library/Logging";
import { UserRequest, UserJwtPayload } from "../types";

export const jwtVerifier = (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    const authorization = req.headers.authorization;

    const token = authorization?.startsWith("Bearer ")
        ? authorization?.replace("Bearer ", "")
        : undefined;

    if (!token || token === "undefined") {
        res.sendStatus(401);
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            config.auth.accessToken.secret
        ) as UserJwtPayload;

        req.userId = decoded.userId;

        next();
    } catch (error) {
        Logging.error(error);

        if (error instanceof TokenExpiredError) {
            res.status(401).json({ message: "jwtVerifier: " + error.message });
        }

        res.status(500).json({ error });
    }
};
