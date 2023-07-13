import Joi from "joi";

const permissionSchema = Joi.object({
  name: Joi.string().required(),
  role_id: Joi.string(),
  code: Joi.number().required(),
});

export default permissionSchema;
