import { NextFunction, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import config from "../config";
import { UserRequest, UserJwtPayload } from "../types/user";
import { UnauthorizedError } from "../utils/AppErrors";

const jwtVerifier = (req: UserRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    const token = authorization?.startsWith("Bearer ")
        ? authorization?.replace("Bearer ", "")
        : undefined;

    if (!token || token === "undefined") {
        throw new UnauthorizedError("No token provided");
    }

    try {
        const decoded = jwt.verify(
            token,
            config.auth.accessToken.secret
        ) as UserJwtPayload;

        req.role = decoded.role;
        req.userId = decoded.userId;
        req.username = decoded.username;

        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new UnauthorizedError(error.message);
        }

        next(error);
    }
};

export default jwtVerifier;
