import Joi from "joi";

import { objectIdSchema, storeLinkSchema } from "./shared";

export const productBodySchema = Joi.object({
    name: Joi.string().required(),
    brandId: objectIdSchema.required(),
    image: Joi.string().uri().required(),
    storeLinks: Joi.array().items(storeLinkSchema).required(),
});

export const productParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
