import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

const storeSchema = Joi.object({
    _id: objectIdSchema.required(),
    name: Joi.string().trim().min(1).max(100).required(),
    link: Joi.string().uri().required(),
});

export const productBodySchema = Joi.object({
    name: Joi.string().required(),
    brandId: objectIdSchema.required(),
    image: Joi.string().uri().required(),
    stores: Joi.array().items(storeSchema).required(),
});

export const productParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
