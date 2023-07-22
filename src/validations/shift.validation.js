import Joi from "joi";
const shiftSchema = Joi.object({
    id_chirlden_pitch :Joi.string().required(),
    timeslot :Joi.array().required(),
    price : Joi.number().required(),
    statusPitch : Joi.boolean().required(),
})
export default shiftSchema;