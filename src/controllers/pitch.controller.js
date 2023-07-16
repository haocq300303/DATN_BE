import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { pitchService } from "../services";
import { pitchValidation } from "../validations";


export const getAll = async (req, res) => {
    try {
        const permissions = await pitchService.getAllLocation();
        res.status(200).json(successfully(permissions, "Lấy dữ liệu thành công"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const getById = async (req, res) => {
    try {
        const permissions = await pitchService.getOnePitch(req.params.id);
        res.status(200).json(successfully(permissions, "Lấy dữ liệu thành công"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const create = async (req, res) => {
    try {
        const { error } = pitchValidation.default.validate(req.body);
        if (error) {
            return res.status(400).json(badRequest(400, error.details[0].message));
        }
        console.log(error);
        const permission = await pitchService.creatPitch(req.body);
        if (!permission) {
            return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
        }
        res.status(200).json(successfully(permission, "Thêm thành công !!!"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const update = async (req, res) => {
    try {
        const { error } = pitchValidation.default.validate(req.body);
        if (error) {
            return res.status(400).json(badRequest(400, error.details[0].message));
        }
        const permission = await pitchService.updatePitch({ ...req.body, id: req.params.id });
        if (!permission) {
            return res.status(400).json(badRequest(400, "Sửa không thành công !!!"));
        }
        res.status(200).json(successfully(permission, "Sửa thành công !!!"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const remove = async (req, res) => {
    try {
        const permission = await pitchService.deletePitch(req.params.id);
        if (!permission) {
            return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
        }
        res.status(200).json(successfully(permission, "Xóa thành công !!!"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};