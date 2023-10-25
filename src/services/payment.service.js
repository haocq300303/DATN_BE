import PaymentModel from "../models/payment.model";
import userModel from "../models/user.model";

export const getList = async (options) => {
    const { skip, limit, sort, ...params } = options;
    return await PaymentModel.find(params)
        .populate([
            {
                path: "user_bank",
                model: userModel,
                select: { name: true, phone_number: true, email: true },
                as: "hi",
            },
            {
                path: "user_receiver",
                model: userModel,
                select: { name: true, phone_number: true, email: true },
            },
        ])
        .sort(sort)
        .skip(skip)
        .limit(limit);
};

export const countDocuments = async () => {
    return await PaymentModel.countDocuments();
};

export const getById = async (paymentId) => {
    return await PaymentModel.findById(paymentId);
};

export const create = async (payment) => {
    const product = new PaymentModel(payment);
    return await product.save();
};
export const update = async (payment) => {
    const { id, ...data } = payment;
    return await PaymentModel.findByIdAndUpdate(payment.id, data, { new: true });
};
export const destroy = async (paymentId) => {
    return await PaymentModel.findByIdAndDelete(paymentId);
};
