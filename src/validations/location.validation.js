import Joi from "joi";

const locationSchema = Joi.object({
    name: Joi.string().required(),
    // pitchs: Joi.string().required(),
});

export default locationSchema;