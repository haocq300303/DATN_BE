import Joi from "joi";

const bannerSchema = Joi.object({
    _id: Joi.string(),
    url: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
});

export default bannerSchema;