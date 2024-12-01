import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import Logging from "../library/Logging";

export const requestValidator = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            Logging.error(error);

            res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((detail) => detail.message),
            });

            return;
        }

        next();
    };
};
