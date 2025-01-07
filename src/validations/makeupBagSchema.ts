import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const makeupBagBodySchema = Joi.object({
    clientId: objectIdSchema.required(),
});

export const makeupBagParamsSchema = Joi.object({
    id: objectIdSchema.required(),
});
