import Joi from "joi";

export const validation = (req, res, next) => {
    const schema = Joi.object({
        pitch_id: Joi.string().required(),
        user_id: Joi.string().required(),
        shift_id: Joi.string().required(),
        children_pitch_id: Joi.string().required(),
        payment_id: Joi.string().required(),
        service_ids: Joi.array().items(Joi.string()),
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
