import { Request, Response, NextFunction } from "express";

import { Logging } from "../library";
import { AppError } from "../utils";

interface CloudinaryError {
    http_code: number;
    message: string;
    name: string;
}

function isCloudinaryError(error: unknown): error is CloudinaryError {
    return (
        typeof error === "object" &&
        error !== null &&
        "http_code" in error &&
        "message" in error &&
        typeof error.message === "string"
    );
}

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

    if (isCloudinaryError(err)) {
        res.status(err.http_code).json({
            success: false,
            name: "CloudinaryError",
            message: err.message,
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};
