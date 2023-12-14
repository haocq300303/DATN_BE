import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string(),
  phone_number: Joi.string(),
  role_id: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
});

export default userSchema;
