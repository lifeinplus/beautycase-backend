import Joi from "joi";

import { objectIdSchema, storeLinkSchema } from "./shared";

export const toolBodySchema = Joi.object({
    brandId: objectIdSchema.required(),
    name: Joi.string().required().min(1).max(100),
    image: Joi.string().required().uri(),
    number: Joi.string().optional().empty(""),
    comment: Joi.string().required().max(500),
    storeLinks: Joi.array().items(storeLinkSchema).required(),
});

export const toolParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
