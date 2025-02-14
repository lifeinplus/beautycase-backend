import Joi from "joi";

export const uploadBodySchema = Joi.object({
    folder: Joi.string().required().valid("products", "stages", "tools"),
});
