import Joi from "joi";

const feedbackSchema = Joi.object({
  id_user: Joi.string().required(),
  id_pitch: Joi.string().required(),
  quantity_star: Joi.number().min(1).max(5).required(),
});

export default feedbackSchema;
