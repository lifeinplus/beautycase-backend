import { NextFunction, Response } from "express";

import { UserRequest } from "../types/auth";
import { UnauthorizedError } from "../utils/AppErrors";

const rolesVerifier = (allowedRoles: string[]) => {
    return (req: UserRequest, res: Response, next: NextFunction) => {
        const { role } = req.user || {};

        if (!role) {
            throw new UnauthorizedError();
        }

        const roles = [...allowedRoles];

        if (!roles.includes(role)) {
            throw new UnauthorizedError();
        }

        next();
    };
};

export default rolesVerifier;
