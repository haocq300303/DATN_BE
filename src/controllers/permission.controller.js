import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { permissionService } from "../services";
import { permissionValidation } from "../validations";

export const getAll = async (req, res) => {
  try {
    const permissions = await permissionService.getAll();
    if (!permissions) {
      return res.status(400).json(badRequest(400, "Lấy dữ liệu thất bại"));
    }
    res.status(200).json(successfully(permissions, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getById = async (req, res) => {
  try {
    const permission = await permissionService.getById(req.params.id);
    if (!permission) {
      return res.status(400).json(badRequest(400, "Lấy dữ liệu thất bại"));
    }
    res.status(200).json(successfully(permission, "Lấy dữ liệu thành công"));
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
    const permission = await permissionService.create(req.body);
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
    const permission = await permissionService.update(req.params.id, req.body, {
      new: true,
    });
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
    const permission = await permissionService.remove(req.params.id);
    if (!permission) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }
    res.status(200).json(successfully(permission, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
