import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const brandBodySchema = Joi.object({
    name: Joi.string().required(),
    link: Joi.string().uri().optional(),
});

export const brandParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
