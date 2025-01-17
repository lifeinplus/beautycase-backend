import Joi from "joi";

import { objectIdSchema } from "./shared";

export const categoryBodySchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
});

export const categoryParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
