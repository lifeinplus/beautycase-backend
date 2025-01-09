import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const stageBodySchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    subtitle: Joi.string().min(10).max(300).required(),
    image: Joi.string().uri().required(),
    steps: Joi.array().items(Joi.string()).optional(),
    selectedProductIds: Joi.array().items(objectIdSchema.required()).optional(),
});

export const stageParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
