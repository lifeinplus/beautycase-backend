import Joi from "joi";

import objectIdSchema from "../shared/objectIdSchema";

const storeLinkSchema = Joi.object({
    _id: objectIdSchema.required(),
    name: Joi.string().trim().min(1).max(100).required(),
    link: Joi.string().uri().required(),
});

export default storeLinkSchema;
