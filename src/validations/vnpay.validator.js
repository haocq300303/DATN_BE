import Joi from "joi";

export const validation = (req, res, next) => {
    const schema = Joi.object({
        user_bank: Joi.string().required(),
        user_receiver: Joi.string().required(),
        vnp_OrderInfo: Joi.string().required(),
        price_received: Joi.number().required(),
        total_received: Joi.number().required(),
        bank_code: Joi.string().allow(""),
        language: Joi.string(),
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
