import Joi from "joi";

import { objectIdSchema } from "./shared";

export const makeupBagBodySchema = Joi.object({
    clientId: objectIdSchema.required(),
    categoryId: objectIdSchema.required(),
    selectedStageIds: Joi.array().items(objectIdSchema).optional(),
    selectedToolIds: Joi.array().items(objectIdSchema).optional(),
});

export const makeupBagParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
