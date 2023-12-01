import Joi from "joi";

const commentSchema = Joi.object({
  id_user: Joi.string().required(),
  content: Joi.string().required(),
  id_post: Joi.string(),
});

export default commentSchema;
