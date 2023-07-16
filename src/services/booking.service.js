import BookingModel from "../models/booking.model";

export const getList = async (options) => {
    const { skip, limit, sort, ...params } = options;
    return await BookingModel.find(params).sort(sort).skip(skip).limit(limit);
};

export const countDocuments = async () => {
    return await BookingModel.countDocuments();
};

export const getById = async (bookingId) => {
    return await BookingModel.findById(bookingId);
};

export const create = async (booking) => {
    const product = new BookingModel(booking);
    return await product.save();
};
export const update = async (booking) => {
    const { id, ...data } = booking;
    return await BookingModel.findByIdAndUpdate(booking.id, data, { new: true });
};
export const destroy = async (bookingId) => {
    return await BookingModel.findByIdAndDelete(bookingId);
};
