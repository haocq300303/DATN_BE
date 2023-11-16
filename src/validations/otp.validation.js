import Joi from "joi";

const otpSchema = Joi.object({
  phone_number: Joi.string().required(),
  otp: Joi.string().required(),
  expireAt: Joi.number().required(),
});

export default otpSchema;
