import mongoose from "mongoose";
import PaymentModel from "../models/payment.model";

export const getRevenueByYear = async (year, pitchUser) => {
    const condition = pitchUser
        ? {
              $match: {
                  user_receiver: new mongoose.Types.ObjectId(pitchUser),
                  createdAt: {
                      $gte: new Date(`${year}-01-01`),
                      $lt: new Date(`${year + 1}-01-01`),
                  },
              },
          }
        : {
              $match: {
                  createdAt: {
                      $gte: new Date(`${year}-01-01`),
                      $lt: new Date(`${year + 1}-01-01`),
                  },
              },
          };
    const pipeLine = [
        condition,
        {
            $group: {
                _id: { month: { $month: "$createdAt" }, year: "$year" },
                totalPrice: { $sum: "$total_received" },
                totalBooking: { $sum: 1 },
                successCount: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
                cancelCount: { $sum: { $cond: [{ $eq: ["$status", "cancel"] }, 1, 0] } },
            },
        },
        {
            $group: {
                _id: null,
                months: {
                    $push: {
                        month: "$_id.month",
                        totalPrice: "$totalPrice",
                        totalBooking: "$totalBooking",
                        successCount: "$successCount",
                        cancelCount: "$cancelCount",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                year: 1,
                months: {
                    $map: {
                        input: { $range: [1, 13] },
                        as: "monthIndex",
                        in: {
                            $cond: [
                                {
                                    $in: ["$$monthIndex", "$months.month"],
                                },
                                {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$months",
                                                as: "month",
                                                cond: { $eq: ["$$month.month", "$$monthIndex"] },
                                            },
                                        },
                                        0,
                                    ],
                                },
                                { month: "$$monthIndex", totalPrice: 0, totalBooking: 0, successCount: 0, cancelCount: 0 },
                            ],
                        },
                    },
                },
            },
        },
        {
            $unwind: "$months",
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$months.totalPrice" },
                months: { $push: "$months" },
            },
        },
        {
            $project: {
                _id: 0,
                year: 1,
                total: 1,
                months: 1,
            },
        },
    ];

    const result = await PaymentModel.aggregate(pipeLine);
    if (result && result[0]) return result[0];

    const months = Array.from({ length: 12 }, (_, index) => ({ totalPrice: 0, month: index + 1 }));
    return { total: 0, months };
};

export const getRevenueByMonth = async ({ month, year, startTime, endTime, pitchUser }) => {
    const condition = pitchUser
        ? {
              $match: {
                  user_receiver: new mongoose.Types.ObjectId(pitchUser),
                  createdAt: {
                      $gte: new Date(year, month - 1, startTime),
                      $lte: new Date(year, month - 1, endTime),
                  },
              },
          }
        : {
              $match: {
                  createdAt: {
                      $gte: new Date(year, month - 1, startTime),
                      $lte: new Date(year, month - 1, endTime),
                  },
              },
          };

    const datesArray = Array.from({ length: +endTime - +startTime + 1 }, (_, index) => new Date(year, month - 1, +startTime + index));

    const pipeLine = [
        condition,
        {
            $group: {
                _id: { $dayOfMonth: "$createdAt" },
                totalPrice: { $sum: "$total_received" },
                totalBooking: { $sum: 1 },
                successCount: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
                cancelCount: { $sum: { $cond: [{ $eq: ["$status", "cancel"] }, 1, 0] } },
            },
        },
    ];

    const result = await PaymentModel.aggregate(pipeLine);

    const groupedData = datesArray.map((date) => {
        const day = date.getDate();
        const found = result.find((item) => item._id === day);
        return {
            day,
            totalPrice: found ? found.totalPrice : 0,
            totalBooking: found ? found.totalBooking : 0,
            successCount: found ? found.successCount : 0,
            cancelCount: found ? found.cancelCount : 0,
        };
    });

    return groupedData;
};
