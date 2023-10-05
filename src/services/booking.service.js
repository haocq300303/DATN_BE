import BookingModel from "../models/booking.model";
import userModel from "../models/user.model";

export const getList = async (options) => {
    const { skip, limit, sort, ...params } = options;
    // return await BookingModel.find(params)
    //     .populate([
    //         {
    //             path: "user_id",
    //             model: userModel,
    //             select: { name: true, phone_number: true, email: true },
    //         },

    //     ])
    //     .sort(sort)
    //     .skip(skip)
    //     .limit(limit);
    return await BookingModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user_id",
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
                localField: "pitch_id",
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
