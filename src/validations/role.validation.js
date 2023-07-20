import Joi from "joi";

const roleSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array(),
});

export default roleSchema;
