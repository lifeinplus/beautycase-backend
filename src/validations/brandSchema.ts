import Joi from "joi";

import objectIdSchema from "./shared/objectIdSchema";

export const brandBodySchema = Joi.object({
    name: Joi.string().required(),
});

export const brandParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
