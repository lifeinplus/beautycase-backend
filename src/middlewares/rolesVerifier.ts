import { NextFunction, Response } from "express";

import { UserRequest } from "../types";
import { UnauthorizedError } from "../utils";

export const rolesVerifier = (allowedRoles: string[]) => {
    return (req: UserRequest, res: Response, next: NextFunction) => {
        if (!req?.role) {
            throw new UnauthorizedError();
        }

        const roles = [...allowedRoles];

        if (!roles.includes(req.role)) {
            throw new UnauthorizedError();
        }

        next();
    };
};
