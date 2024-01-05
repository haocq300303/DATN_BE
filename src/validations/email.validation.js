import Joi from "joi";

const emailSchema = Joi.object({
  email_to: Joi.string().required(),
  subject: Joi.string().required(),
  content: Joi.string().required(),
  html: Joi.string(),
});

export default emailSchema;
