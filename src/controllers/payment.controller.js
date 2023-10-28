import { serverError } from "../formatResponse/serverError";
import * as PaymentService from "../services/payment.service";

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

        const [payments, count] = await Promise.all([PaymentService.getList(options), PaymentService.countDocuments()]);

        res.status(200).json({
            meassge: "Success",
            data: payments,
            currentPage: page,
            totalPage: Math.ceil(count / limit),
            length: payments.length,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const getById = async (req, res) => {
    try {
        const payment = await PaymentService.getById(req.params.id);
        res.json({
            meassge: "Success",
            data: payment,
        });
    } catch (error) {
        console.log(error);
    }
};
export const create = async (req, res) => {
    try {
        const newPayment = await PaymentService.create(req.body);
        res.json({
            meassge: "New booking success",
            data: newPayment,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const update = async (req, res) => {
    try {
        const paymentUpdated = await PaymentService.update({ ...req.body, id: req.params.id });
        res.json({
            meassge: "Update booking success",
            data: paymentUpdated,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const destroy = async (req, res) => {
    try {
        const paymentDestroyed = await PaymentService.destroy(req.params.id);
        res.json({
            meassge: "Delete booking successfully",
            data: paymentDestroyed,
        });
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};
