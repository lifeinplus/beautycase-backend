import Joi from "joi";

import { objectIdSchema } from "./shared";

export const storeBodySchema = Joi.object({
    name: Joi.string().required(),
});

export const storeParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
