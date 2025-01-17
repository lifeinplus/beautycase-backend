import Joi from "joi";
import mongoose from "mongoose";

import { storeSchema } from "./storeSchema";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const toolBodySchema = Joi.object({
    name: Joi.string().required().min(1).max(100),
    brandId: objectIdSchema.required(),
    image: Joi.string().required().uri(),
    stores: Joi.array().items(storeSchema).required(),
    number: Joi.string().optional().empty(""),
    comment: Joi.string().optional().empty("").max(500),
});

export const toolParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
