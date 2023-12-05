import Joi from "joi";

const childrenPitchSchema = Joi.object({
  idParentPitch: Joi.string().required(),
  code_chirldren_pitch: Joi.number().min(1).required(),
  image: Joi.string().required(),
});

export default childrenPitchSchema;
