import Joi from "joi";
const shiftSchema = Joi.object({
    id_chirlden_pitch :Joi.string(),
    number_shift:Joi.number(),
    time_start :Joi.string().required(),
    time_end :Joi.string().required(),
    price : Joi.number().required(),
    statusPitch : Joi.boolean(),
})
export default shiftSchema;