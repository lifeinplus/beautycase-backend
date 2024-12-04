import { Request, Response, NextFunction } from "express";

import { Logging } from "../library";
import { AppError } from "../utils";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Logging.error(err);

    if (err instanceof AppError) {
        res.status(err.status).json({
            success: false,
            name: err.name,
            message: err.message,
            details: err.details,
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};
