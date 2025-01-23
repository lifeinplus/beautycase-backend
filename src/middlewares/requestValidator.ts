import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { BadRequestError } from "../utils";

interface Schemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
}

interface SchemaValue {
    type: string;
}

const parseObjectFields = (data: any, schema: ObjectSchema) => {
    const schemaDescription = schema.describe();
    const objectFields = Object.entries(schemaDescription.keys || {})
        .filter(([, value]) => (value as SchemaValue).type === "object")
        .map(([key]) => key);

    objectFields.forEach((field) => {
        if (data[field] && typeof data[field] === "string") {
            try {
                data[field] = JSON.parse(data[field]);
            } catch {
                throw new BadRequestError(`Failed to parse '${field}' as JSON`);
            }
        }
    });

    return data;
};

export const requestValidator = (schemas: Schemas) => {
    const options = {
        abortEarly: false,
    };

    return (req: Request, res: Response, next: NextFunction) => {
        if (schemas.body) {
            req.body = parseObjectFields(req.body, schemas.body);

            const { error } = schemas.body.validate(req.body, options);

            // console.log(req.body);
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
