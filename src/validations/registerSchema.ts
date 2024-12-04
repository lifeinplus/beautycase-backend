import Joi from "joi";

import config from "../config";

export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.base": "Username must be a string",
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username must not exceed 30 characters",
        "any.required": "Username is required",
    }),
    password: Joi.string()
        .min(config.auth.passwordLengthMin)
        .required()
        .messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
            "string.min": `Password must be at least ${config.auth.passwordLengthMin} characters long`,
            "any.required": "Password is required",
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required",
        }),
});
