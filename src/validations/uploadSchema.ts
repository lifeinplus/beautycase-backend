import Joi from "joi";

export const uploadFileBodySchema = Joi.object({
    folder: Joi.string()
        .required()
        .valid("products", "questionnaires", "stages", "tools"),
});

export const uploadUrlBodySchema = Joi.object({
    folder: Joi.string()
        .required()
        .valid("products", "questionnaires", "stages", "tools"),
    imageUrl: Joi.string().required().uri(),
});
