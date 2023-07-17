import Joi from "joi";

const permissionSchema = Joi.object({
  name: Joi.string().min(3).required(),
  role_id: Joi.string().required(),
  code: Joi.number().required(),
});

export default permissionSchema;
