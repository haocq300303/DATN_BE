import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import * as bannerService  from "../services/banner.service";
import { bannerValidation } from "../validations";
export const getAll = async (req, res) => {
  try {
    const banner = await bannerService.getAll();
    res.status(200).json(successfully(banner, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
}
  export const getOne = async (req, res) => {
    try {
      const banner = await bannerService.getById(req.params.id);
      res.json({
        meassge: "Lây dữ liệu thành công",
        data: banner,
    });
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
    const banner = await bannerService.createDT(req.body);
    if (!banner) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }
    res.status(200).json(successfully(banner, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const { error } = bannerValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const banner = await bannerService.update({...req.body,id: req.params.id});
    if (!banner) {
      return res
        .status(400)
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }
    res.status(200).json(successfully(banner, "Cập nhật thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
    try {
        const banner = await bannerService.remove(req.params.id);
        if (!banner) {
        return res
            .status(400)
            .json(badRequest(400, "Xóa không thành công !!!"));
        }
        res.status(200).json(successfully(banner, "Xóa thành công !!!"));
    } catch  (error) {
        res.status(500).json(serverError(error.message));
    }
}