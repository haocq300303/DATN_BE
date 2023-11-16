import Joi from "joi";

const bannerSchema = Joi.object({
    url: Joi.string().required(),
    content: Joi.string().required(),
});

export default bannerSchema;