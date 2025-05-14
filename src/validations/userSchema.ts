import Joi from "joi";

import objectIdSchema from "./shared/objectIdSchema";

export const userParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
