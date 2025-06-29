import { NextFunction, Response } from "express";

import LessonModel from "../models/LessonModel";
import type { UserRequest } from "../types/auth";
import { NotFoundError } from "../utils/AppErrors";

export const checkLessonAccess = async (
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
            const lesson = await LessonModel.findById(id).select("clientIds");

            if (!lesson || !userId || !lesson.clientIds?.includes(userId)) {
                throw new NotFoundError("Lesson not found");
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};
