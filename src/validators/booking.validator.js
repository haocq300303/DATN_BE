import Joi from 'joi';

export const validator = (req, res, next) => {
    const schema = Joi.object({
        id_pitch: Joi.string().required(),
        id_user: Joi.string().required(),
        id_shift: Joi.string().required(),
        id_children_pitch: Joi.string().required(),
        id_payment: Joi.string().required(),
        price: Joi.number().required()
    });

    const result = schema.validate(req.body);

    try {
        if (result.error) {
            return res.status(401).json({ error: 2, message: result.error.details[0].message });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            err: 1,
            message: new Error(err).message,
        });
    }
};