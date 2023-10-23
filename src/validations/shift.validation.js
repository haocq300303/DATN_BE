import Joi from "joi";
const shiftSchema = Joi.object({
    id_chirlden_pitch :Joi.string(),
    timeslot :Joi.string().required(),
    price : Joi.number().required(),
    statusPitch : Joi.boolean().required(),
})
export default shiftSchema;