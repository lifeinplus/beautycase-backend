import Joi from "joi";

import { objectIdSchema } from "./shared";

export const userParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
