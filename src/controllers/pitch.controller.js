import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { pitchService } from "../services";
import { pitchValidation } from "../validations";


export const getAll = async (req, res) => {
    try {
        const pitch = await pitchService.getAllPitch();
        res.status(200).json(successfully(pitch, "Lấy dữ liệu thành công"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const getById = async (req, res) => {
    try {
        const pitch = await pitchService.getOnePitch(req.params.id);
        res.status(200).json(successfully(pitch, "Lấy dữ liệu thành công"));
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
        const pitch = await pitchService.creatPitch(req.body);
        if (!pitch) {
            return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
        }
        res.status(200).json(successfully(pitch, "Thêm thành công !!!"));
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
        const pitch = await pitchService.updatePitch({ ...req.body, id: req.params.id });
        if (!pitch) {
            return res.status(400).json(badRequest(400, "Sửa không thành công !!!"));
        }
        res.status(200).json(successfully(pitch, "Sửa thành công !!!"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};

export const remove = async (req, res) => {
    try {
        const pitch = await pitchService.deletePitch(req.params.id);
        if (!pitch) {
            return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
        }
        res.status(200).json(successfully(pitch, "Xóa thành công !!!"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
};