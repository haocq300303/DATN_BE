import Joi from "joi";

const postSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().required(),
  comment_id: Joi.array(),
});

export default postSchema;
