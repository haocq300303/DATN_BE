import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { bannerService } from "../services";
import { bannerValidation } from "../validations";
import Banner from "../models/banner.model";

export const getAll = async (req, res) => {
  try {
    const banner = await bannerService.getAll();
    res.status(200).json(successfully(banner, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  try {
    const { error } = bannerValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const banner = await Banner.create(req.body);
    if (!banner) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }
    res.status(200).json(successfully(banner, "Thêm thành công !!!"));
  } catch {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const { error } = bannerValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const banner = await Banner.update(req.params.id, req.body, {
      new: true,
    });
    if (!banner) {
      return res
        .status(400)
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }
    res.status(200).json(successfully(banner, "Cập nhật thành công !!!"));
  } catch {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
    try {
        const banner = await Banner.remove(req.params.id);
        if (!banner) {
        return res
            .status(400)
            .json(badRequest(400, "Xóa không thành công !!!"));
        }
        res.status(200).json(successfully(banner, "Xóa thành công !!!"));
    } catch {
        res.status(500).json(serverError(error.message));
    }
}