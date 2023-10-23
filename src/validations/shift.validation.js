import Joi from "joi";
const shiftSchema = Joi.object({
  shift_name: Joi.number().min(1).required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  price: Joi.number().required(),
  statusPitch: Joi.boolean(),
});
export default shiftSchema;
