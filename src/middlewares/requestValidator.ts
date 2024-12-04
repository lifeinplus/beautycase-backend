import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { BadRequestError } from "../utils";

export const requestValidator = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            throw new BadRequestError(
                "Validation failed",
                error.details.map((detail) => detail.message)
            );
        }

        next();
    };
};
