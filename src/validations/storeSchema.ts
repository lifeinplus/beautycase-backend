import Joi from "joi";
import mongoose from "mongoose";

const objectIdSchema = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: "Invalid MongoDB ObjectID" });
    }
    return value;
}, "ObjectID Validation");

export const storeSchema = Joi.object({
    _id: objectIdSchema.required(),
    name: Joi.string().trim().min(1).max(100).required(),
    link: Joi.string().uri().required(),
});
