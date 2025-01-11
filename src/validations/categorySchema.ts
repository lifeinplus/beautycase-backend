import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const categoryBodySchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
});

export const categoryParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
