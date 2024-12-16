import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { BadRequestError } from "../utils";

interface Schemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
}

export const requestValidator = (schemas: Schemas) => {
    const options = {
        abortEarly: false,
    };

    return (req: Request, res: Response, next: NextFunction) => {
        if (schemas.body) {
            const { error } = schemas.body.validate(req.body, options);

            // console.log(error);

            if (error) {
                throw new BadRequestError(
                    "Validation failed for body",
                    error.details.map((detail) => detail.message)
                );
            }
        }

        if (schemas.params) {
            const { error } = schemas.params.validate(req.params, options);
            if (error) {
                throw new BadRequestError(
                    "Validation failed for params",
                    error.details.map((detail) => detail.message)
                );
            }
        }

        next();
    };
};
