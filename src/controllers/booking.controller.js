import * as BookingService from "../services/booking.service";
import { serverError } from "../formatResponse/serverError";

export const getList = async (req, res) => {
    try {
        const { _sort = "createdAt", page = 1, limit = 10, _order = "desc", ...params } = req.query;
        const options = {
            skip: (page - 1) * limit,
            limit,
            sort: {
                [_sort]: _order === "desc" ? -1 : 1,
            },
            ...params,
        };

        const [bookings, count] = await Promise.all([BookingService.getList(options), BookingService.countDocuments()]);

        res.status(200).json({
            meassge: "Success",
            data: bookings,
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            length: bookings.length,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const getById = async (req, res) => {
    try {
        const booking = await BookingService.getById(req.params.id);
        res.json({
            meassge: "Success",
            data: booking,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};
export const create = async (req, res) => {
    try {
        const newBooking = await BookingService.create(req.body);
        res.json({
            meassge: "New booking success",
            data: newBooking,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const getByField = async (req, res) => {
    try {
        const bookingDb = await BookingService.getByField(req.query);

        res.json({
            meassge: "Lấy dữ liệu booking thành công",
            data: bookingDb,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const createAffterPay = async (req, res) => {
    try {
        const { payment_id } = req.body;
        const bookingDb = await BookingService.getOne({ payment_id });
        if (bookingDb) {
            return res.status(200).json({ message: "Sân đã được đặt trước đó" });
        }

        const newBooking = await BookingService.create(req.body);
        res.status(201).json({
            meassge: "New booking success",
            data: newBooking,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const update = async (req, res) => {
    try {
        const bookingUpdated = await BookingService.update({ ...req.body, id: req.params.id });
        res.json({
            meassge: "Update booking success",
            data: bookingUpdated,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const destroy = async (req, res) => {
    try {
        const bookingDeleted = await BookingService.destroy(req.params.id);
        res.json({
            meassge: "Delete booking successfully",
            data: bookingDeleted,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};
