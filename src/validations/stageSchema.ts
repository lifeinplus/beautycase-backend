import Joi from "joi";

import { objectIdSchema } from "./shared";

export const stageBodySchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    subtitle: Joi.string().min(10).max(300).required(),
    imageUrl: Joi.string().uri().required(),
    comment: Joi.string().optional().max(500),
    steps: Joi.array().items(Joi.string()).optional(),
    productIds: Joi.array().items(objectIdSchema.required()).required(),
});

export const stageParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
