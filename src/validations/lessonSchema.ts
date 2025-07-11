import Joi from "joi";

import objectIdSchema from "./shared/objectIdSchema";

export const lessonBodySchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    shortDescription: Joi.string().min(10).max(300).required(),
    videoUrl: Joi.string().uri().required(),
    fullDescription: Joi.string().min(20).max(2000).required(),
    productIds: Joi.array().items(objectIdSchema),
    clientIds: Joi.array().items(objectIdSchema),
});

export const lessonProductsBodySchema = Joi.object({
    productIds: Joi.array().items(objectIdSchema),
});

export const lessonParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
