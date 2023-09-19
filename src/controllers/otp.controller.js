import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { otpService } from "../services";
import { otpValidation } from "../validations";

export const getAll = async (req, res) => {
  try {
    const otps = await otpService.getAll();
    if (!otps) {
      return res.status(400).json(badRequest(400, "Lấy dữ liệu thất bại"));
    }
    res.status(200).json(successfully(otps, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getById = async (req, res) => {
  try {
    const otp = await otpService.getById(req.params.id);
    if (!otp) {
      return res.status(400).json(badRequest(400, "Lấy dữ liệu thất bại"));
    }
    res.status(200).json(successfully(otp, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  try {
    const { error } = otpValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const otp = await otpService.create(req.body);
    if (!otp) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }
    res.status(200).json(successfully(otp, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const otp = await otpService.update(req.params.id, req.body, {
      new: true,
    });
    if (!otp) {
      return res
        .status(400)
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }
    res.status(200).json(successfully(otp, "Cập nhật thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const otp = await otpService.remove(req.params.id);
    if (!otp) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }
    res.status(200).json(successfully(otp, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
