import Joi from "joi";
const childrenPitchSchema = Joi.object({
    idParentPitch : Joi.string().required(),
    code_chirldren_pitch : Joi.number().required(),
    idShifts: Joi.array(),
    date: Joi.string(),
});
export default childrenPitchSchema;
