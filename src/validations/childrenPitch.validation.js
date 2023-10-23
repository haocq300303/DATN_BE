import Joi from "joi";
const childrenPitchSchema = Joi.object({
    idParentPitch : Joi.string().required(),
    code_chirldren_pitch : Joi.number().required(),
    // images:Joi.array().required(),
});
export default childrenPitchSchema;