import mongoose, { ObjectId } from "mongoose";
import BookingModel from "../models/booking.model";

const pipeLine = [
    {
        $unwind: {
            path: "$service_ids",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $addFields: {
            userId: { $toObjectId: "$user_id" },
            pitchId: { $toObjectId: "$pitch_id" },
            paymentId: { $toObjectId: "$payment_id" },
            shiftId: { $toObjectId: "$shift_id" },
            childrenPitchId: { $toObjectId: "$children_pitch_id" },
            serviceIds: { $toObjectId: "$service_ids" },
        },
    },
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
            from: "childrenpitches",
            localField: "childrenPitchId",
            foreignField: "_id",
            as: "childrenPitch",
        },
    },
    {
        $unwind: { path: "$childrenPitch", preserveNullAndEmptyArrays: true },
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
        $lookup: {
            from: "shifts",
            localField: "shiftId",
            foreignField: "_id",
            as: "shift",
        },
    },
    {
        $unwind: { path: "$shift", preserveNullAndEmptyArrays: true },
    },
    {
        $lookup: {
            from: "services",
            localField: "serviceIds",
            foreignField: "_id",
            as: "services",
        },
    },
    {
        $group: {
            _id: "$_id",
            fields: { $first: "$$ROOT" },
            services: { $push: { $arrayElemAt: ["$services", 0] } },
        },
    },
    {
        $replaceRoot: {
            newRoot: {
                $mergeObjects: ["$fields", { services: "$services" }],
            },
        },
    },
    {
        $project: {
            user_id: 1,
            user_booking: {
                _id: "$user._id",
                name: "$user.name",
                email: "$user.email",
                phone_number: "$user.phone_number",
            },
            payment_id: 1,
            pitch_id: 1,
            children_pitch_id: 1,
            pitch: {
                _id: "$pitch._id",
                name: "$pitch.name",
                avatar: "$pitch.avatar",
                address: "$pitch.address",
                price: "$pitch.price",
            },
            childrenPitch: 1,
            payment: {
                _id: "$payment._id",
                payment_method: "$payment.method",
                price_received: "$payment.price_received",
                code: "$payment.code",
                total_received: "$payment.total_received",
                status: "$payment.status",
                message: "$payment.message",
            },
            status: 1,
            pitch_code: "$childrenPitch.code_chirldren_pitch",
            shift_id: 1,
            shift: 1,
            services: {
                $map: {
                    input: "$services",
                    as: "item",
                    in: {
                        _id: "$$item._id",
                        name: "$$item.name",
                        image: "$$item.image",
                        price: "$$item.price",
                    },
                },
            },
            createdAt: 1,
            updatedAt: 1,
        },
    },
];

export const getList = async (options) => {
    const { skip, limit, sort, ...query } = options;

    const filter = {
        ...query,
    };

    return await BookingModel.aggregate([
        {
            $match: filter,
        },
        ...pipeLine,
        // {
        //     $match: {
        //         "user_booking.name": {
        //             $regex: "hii",
        //             $options: "i",
        //         },
        //     },
        // },
        {
            $sort: sort,
        },
    ]);
};

export const countDocuments = async () => {
    return await BookingModel.countDocuments();
};

export const getById = async (bookingId) => {
    return await BookingModel.findById(bookingId);
};
export const getOne = async (condition) => {
    return await BookingModel.findOne(condition);
};
export const getByField = async (field) => {
    const { _id, ...obj } = field;
    let condition = [{ $match: obj }];

    if (_id) {
        condition = [{ $match: { _id: new mongoose.Types.ObjectId(_id) } }];
    }
    const result = await BookingModel.aggregate([...condition, ...pipeLine]);

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
