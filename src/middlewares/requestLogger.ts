import { NextFunction, Request, Response } from "express";
import { Logging } from "../library";

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { method, url } = req;
    Logging.infoIn(`Method: [{method}] - URL: [${url}]`, method);

    res.on("finish", () => {
        const { statusCode } = res;
        Logging.infoOut(
            `Method: [{method}] - URL: [${url}] - Status: [${statusCode}]`,
            method
        );
    });

    next();
};
