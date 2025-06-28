import { NextFunction, Response } from "express";

import MakeupBagModel from "../models/MakeupBagModel";
import type { UserRequest } from "../types/auth";
import { NotFoundError } from "../utils/AppErrors";

export const checkMakeupBagAccess = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { role, userId } = req.user || {};

        if (["admin", "mua"].includes(role || "")) {
            return next();
        }

        if (role === "client") {
            const makeupBag = await MakeupBagModel.findById(id).select(
                "clientId"
            );

            if (
                !makeupBag ||
                !userId ||
                makeupBag.clientId.toString() !== userId
            ) {
                throw new NotFoundError("MakeupBag not found");
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};
