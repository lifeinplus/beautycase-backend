import Joi from "joi";

export const questionnaireSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Имя обязательно для заполнения",
    }),
    instagram: Joi.string().required().messages({
        "string.empty": "Ник в Инстаграм обязателен",
    }),
    city: Joi.string(),
    age: Joi.number(),
    makeupBag: Joi.string().required().messages({
        "string.empty": "Укажите, что сейчас есть в косметичке",
    }),
    procedures: Joi.object({
        lashExtensions: Joi.boolean(),
        browCorrection: Joi.boolean(),
        lashLamination: Joi.boolean(),
        none: Joi.boolean(),
    }),
    skinType: Joi.string(),
    allergies: Joi.string().allow(""),
    peeling: Joi.boolean(),
    pores: Joi.boolean(),
    oilyShine: Joi.boolean(),
    currentSkills: Joi.string().allow(""),
    desiredSkills: Joi.string().allow(""),
    makeupTime: Joi.string().valid(
        "до 15 минут",
        "15 - 25 минут",
        "30 - 60 минут"
    ),
    budget: Joi.string().valid(
        "до 3 тыс. рублей",
        "до 5 тыс. рублей",
        "до 10 тыс. рублей",
        "более 10 тыс. рублей"
    ),
    brushes: Joi.boolean(),
    problems: Joi.object({
        eyeshadowCrease: Joi.boolean(),
        mascaraSmudge: Joi.boolean(),
        foundationPores: Joi.boolean(),
        foundationStay: Joi.boolean(),
        sculpting: Joi.boolean(),
        eyeshadowMatch: Joi.boolean(),
        other: Joi.string().allow(""),
    }),
    referral: Joi.string().valid("Инстаграм", "Ютуб", "Другое"),
});
