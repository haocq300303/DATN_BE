import Joi from "joi";

const shiftSchema = Joi.object({
  id_chirlden_pitch: Joi.string().required(),
  id_pitch: Joi.string().required(),
  number_shift: Joi.number().min(1).required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  price: Joi.number().required(),
  status_shift: Joi.string(),
  date: Joi.date().required(),
  find_opponent: Joi.string(),
});

export default shiftSchema;
