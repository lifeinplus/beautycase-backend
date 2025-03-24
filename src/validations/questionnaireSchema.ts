import Joi from "joi";

import { objectIdSchema } from "./shared";

export const questionnaireBodySchema = Joi.object({
    age: Joi.number(),
    allergies: Joi.string().allow(""),
    budget: Joi.string().valid("150", "150-250", "250"),
    brushes: Joi.string().valid("yes", "no"),
    city: Joi.string(),
    currentSkills: Joi.string().allow(""),
    desiredSkills: Joi.object({
        delicate: Joi.boolean().required(),
        evening: Joi.boolean().required(),
        bright: Joi.boolean().required(),
        office: Joi.boolean().required(),
        filming: Joi.boolean().required(),
    }).optional(),
    instagram: Joi.string(),
    makeupBag: Joi.string().required().messages({
        "string.empty": "Укажите, что сейчас есть в косметичке",
    }),
    makeupBagPhotoUrl: Joi.string().uri(),
    makeupTime: Joi.string().valid("15", "15-30", "30-60"),
    name: Joi.string().required().messages({
        "string.empty": "Укажите ваше имя",
    }),
    oilyShine: Joi.string(),
    peeling: Joi.string(),
    pores: Joi.string(),
    problems: Joi.object({
        eyeshadowCrease: Joi.boolean(),
        mascaraSmudge: Joi.boolean(),
        foundationPores: Joi.boolean(),
        foundationStay: Joi.boolean(),
        sculpting: Joi.boolean(),
        eyeshadowMatch: Joi.boolean(),
        other: Joi.string().allow(""),
    }),
    procedures: Joi.object({
        lashExtensions: Joi.boolean(),
        browCorrection: Joi.boolean(),
        lashLamination: Joi.boolean(),
        none: Joi.boolean(),
    }),
    referral: Joi.string().valid(
        "instagram",
        "youtube",
        "personal",
        "recommendation",
        "other"
    ),
    skinType: Joi.string(),
});

export const questionnaireParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
