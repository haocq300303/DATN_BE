import Joi from "joi";

const serviceSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
});

export default serviceSchema;