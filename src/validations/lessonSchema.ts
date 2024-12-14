import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const bodySchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    shortDescription: Joi.string().min(10).max(300).required(),
    videoUrl: Joi.string().uri().required(),
    fullDescription: Joi.string().min(20).max(2000).required(),
    materials: Joi.array().items(Joi.string().uri().allow("")).optional(),
});

export const paramsSchema = Joi.object({
    id: objectIdSchema.required(),
});
