import Joi from "joi";

import objectIdSchema from "./shared/objectIdSchema";

export const makeupBagBodySchema = Joi.object({
    categoryId: objectIdSchema.required(),
    clientId: objectIdSchema.required(),
    stageIds: Joi.array().items(objectIdSchema.required()).required(),
    toolIds: Joi.array().items(objectIdSchema.required()).required(),
});

export const makeupBagParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
