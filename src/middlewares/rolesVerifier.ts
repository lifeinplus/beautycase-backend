import { NextFunction, Response } from "express";

import { UserRequest } from "../types/auth";
import { UnauthorizedError } from "../utils/AppErrors";

const rolesVerifier = (allowedRoles: string[]) => {
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

export default rolesVerifier;
