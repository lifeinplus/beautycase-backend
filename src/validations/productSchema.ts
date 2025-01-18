import Joi from "joi";

import { objectIdSchema, storeLinkSchema } from "./shared";

export const productBodySchema = Joi.object({
    name: Joi.string().required().min(1).max(100),
    brandId: objectIdSchema.required(),
    image: Joi.string().required().uri(),
    shade: Joi.string().required(),
    comment: Joi.string().required().max(500),
    storeLinks: Joi.array().items(storeLinkSchema).required(),
});

export const productParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
