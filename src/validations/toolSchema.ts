import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const toolBodySchema = Joi.object({
    brandId: objectIdSchema.required(),
    name: Joi.string().required().min(1).max(100),
    image: Joi.string().required().uri(),
    number: Joi.string().optional().empty(""),
    comment: Joi.string().optional().empty("").max(500),
});

export const toolParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
