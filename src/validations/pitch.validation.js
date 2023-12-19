import Joi from 'joi';

const pitchSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  admin_pitch_id: Joi.string(),
  images: Joi.array().items(Joi.string()).required(),
  numberPitch: Joi.number().required(),
  description: Joi.string().required(),
  location_id: Joi.string().required(),
  districts_id: Joi.string(),
  average_price: Joi.number(),
  avatar: Joi.string().required(),
});

export default pitchSchema;
