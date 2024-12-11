import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const bodySchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    buy: Joi.string().required(),
});

export const paramsSchema = Joi.object({
    id: objectIdSchema.required(),
});
