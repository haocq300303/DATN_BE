import mongoose, { ObjectId } from "mongoose";
import BookingModel from "../models/booking.model";

export const getList = async (options) => {
    const { skip, limit, sort, ...query } = options;
    const filter = {
        ...query,
    };

    return await BookingModel.aggregate([
        {
            $match: filter,
        },
        { $addFields: { userId: { $toObjectId: "$user_id" }, pitchId: { $toObjectId: "$pitch_id" } } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: "pitches",
                localField: "pitchId",
                foreignField: "_id",
                as: "pitch",
            },
        },
        {
            $unwind: { path: "$pitch", preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                user_booking: {
                    _id: "$user._id",
                    name: "$user.name",
                    email: "$user.email",
                },
                payment_id: 1,
                pitch: {
                    _id: "$pitch._id",
                    name: "$pitch.name",
                    avatar: "$pitch.avatar",
                    address: "$pitch.address",
                },
                shift_id: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);
};

export const countDocuments = async () => {
    return await BookingModel.countDocuments();
};

export const getById = async (bookingId) => {
    return await BookingModel.findById(bookingId);
};
export const getOne = async ({ field }) => {
    return await BookingModel.findOne({ [field]: field });
};
export const getByPaymentId = async (payment_id) => {
    const result = await BookingModel.aggregate([
        {
            $match: { payment_id },
        },
        { $addFields: { paymentId: { $toObjectId: "$payment_id" } } },
        {
            $lookup: {
                from: "payment",
                localField: "paymentId",
                foreignField: "_id",
                as: "payment",
            },
        },
        {
            $unwind: { path: "$payment", preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                payment_id: 1,
                payment: 1,
                shift_id: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    return result.length > 0 ? result[0] : null;
};

export const create = async (booking) => {
    const newBooking = new BookingModel(booking);
    return await newBooking.save();
};
export const createAffterPay = async (booking) => {
    const newBooking = new BookingModel(booking);
    return await newBooking.save();
};
export const update = async (booking) => {
    const { id, ...data } = booking;
    return await BookingModel.findByIdAndUpdate(booking.id, data, { new: true });
};
export const destroy = async (bookingId) => {
    return await BookingModel.findByIdAndDelete(bookingId);
};
