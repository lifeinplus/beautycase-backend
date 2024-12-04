import Joi from "joi";

export const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        "string.base": "Username must be a string",
        "string.empty": "Username is required",
        "any.required": "Username is required",
    }),
    password: Joi.string().required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
});
