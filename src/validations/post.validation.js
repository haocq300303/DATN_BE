import Joi from "joi";

const postSchema = Joi.object({
  id_user: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().required(),
  comment_id: Joi.array(),
});

export default postSchema;
