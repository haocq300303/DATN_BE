import Joi from "joi";

const locationSchema = Joi.object({
  name: Joi.string().required(),
  pitchs: Joi.array().required(),
});

export default locationSchema;
