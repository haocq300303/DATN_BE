import Joi from "joi";

const shiftSchema = Joi.object({
  id_chirlden_pitch: Joi.string(),
  id_pitch: Joi.string().required(),
  number_shift: Joi.number().allow(null).min(1).required(),
  start_time: Joi.string().allow(null).required(),
  end_time: Joi.string().allow(null).required(),
  price: Joi.number().required(),
  status_shift: Joi.boolean(),
  date: Joi.array(),
  find_opponent: Joi.string(),
  default: Joi.boolean(),
  is_booking_month: Joi.boolean(),
  isCancelBooking: Joi.boolean(),
});

export default shiftSchema;
