import Joi from "joi";

import { objectIdSchema } from "./shared";

export const brandBodySchema = Joi.object({
    name: Joi.string().required(),
    link: Joi.string().uri().optional(),
});

export const brandParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
