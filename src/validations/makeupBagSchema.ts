import Joi from "joi";

import { objectIdSchema } from "./shared";

export const makeupBagBodySchema = Joi.object({
    categoryId: objectIdSchema.required(),
    clientId: objectIdSchema.required(),
    selectedStageIds: Joi.array().items(objectIdSchema.required()).required(),
    selectedToolIds: Joi.array().items(objectIdSchema.required()).required(),
});

export const makeupBagParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
