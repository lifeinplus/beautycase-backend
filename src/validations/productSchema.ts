import Joi from "joi";

import objectIdSchema from "./shared/objectIdSchema";
import storeLinkSchema from "./shared/storeLinkSchema";

export const productBodySchema = Joi.object({
    brandId: objectIdSchema.required(),
    name: Joi.string().required().min(1).max(100),
    imageUrl: Joi.string().required().uri(),
    shade: Joi.string().optional().allow(""),
    comment: Joi.string().required().max(500),
    storeLinks: Joi.array().items(storeLinkSchema).required(),
});

export const productParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
