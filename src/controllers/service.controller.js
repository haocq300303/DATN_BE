import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";

import { serviceService } from "../services";
import { serviceValidation } from "../validations";
import Service from "../models/service.model";

export const getAll = async (req, res) => {
    try {
        const service = await serviceService.getAll();
        res.status(200).json(successfully(service, "Lấy dữ liệu thành công"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
}

export const create = async (req, res) => {
    try {
        const { error } = serviceValidation.default.validate(req.body);
        if (error) {
            return res.status(400).json(badRequest(400, error.details[0].message));
        }
        const service = await Service.create(req.body);
        if (!service) {
            return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
        }
        res.status(200).json(successfully(service, "Thêm thành công !!!"));
    } catch {
        res.status(500).json(serverError(error.message));
    }
}

export const update = async (req, res) => {
    try {
        const { error } = serviceValidation.default.validate(req.body);
        if (error) {
            return res.status(400).json(badRequest(400, error.details[0].message));
        }
        const service = await Service.update(req.params.id, req.body, {
            new: true,
        });
        if (!service) {
            return res
                .status(400)
                .json(badRequest(400, "Cập nhật không thành công !!!"));
        }
        res.status(200).json(successfully(service, "Cập nhật thành công !!!"));
    } catch {
        res.status(500).json(serverError(error.message));
    }
}

export const remove = async (req, res) => {
    try {
        const service = await Service.remove(req.params.id);
        if (!service) {
            return res
                .status(400)
                .json(badRequest(400, "Xóa không thành công !!!"));
        }
        res.status(200).json(successfully(service, "Xóa thành công !!!"));
    } catch {
        res.status(500).json(serverError(error.message));
    }
}
