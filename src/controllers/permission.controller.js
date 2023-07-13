import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { permissionService } from "../services";
import { permissionValidation } from "../validations";
import Permission from "../models/permission.model";

export const getAll = async (req, res) => {
  try {
    const permissions = await permissionService.getAll();
    res.status(200).json(successfully(permissions, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  try {
    const { error } = permissionValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const permission = await Permission.create(req.body);
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
    const { error } = permissionValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!permission) {
      return res
        .status(400)
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }
    res.status(200).json(successfully(permission, "Cập nhật thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }
    res.status(200).json(successfully(permission, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
