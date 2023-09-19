import Joi from "joi";

const serviceSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    id_Pitch: Joi.string(),
    image: Joi.string().required(),
});

export default serviceSchema;