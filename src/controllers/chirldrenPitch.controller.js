import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { childrenPitchService, pitchService } from "../services";
import { chilrenPitchValdation } from "../validations";

export const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      _sort = "createdAt",
      _order = "asc",
      ...params
    } = req.query;

    const options = {
      page,
      limit,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1,
      },
      ...params,
      customLabels: {
        docs: "data",
      },
    };

    const childrenPitchs = await childrenPitchService.getAll(options);
    if (!childrenPitchs || childrenPitchs.length === 0) {
      return res.status(400).json(badRequest(400, "Không có sân nào cả"));
    }
    res.status(200).json(successfully(childrenPitchs, "lấy dữ lệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getByID = async (req, res) => {
  try {
    const childrenPitch = await childrenPitchService.getById(req.params.id);
    if (!childrenPitch) {
      return res.status(400).json(badRequest(400, "Không có sân nào cả"));
    }
    res.status(200).json(successfully(childrenPitch, "lấy dữ lệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  try {
    const { idParentPitch } = req.body;
    const { error } = chilrenPitchValdation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const pitch = await pitchService.getOnePitch(idParentPitch);
    const childrenPitchs = await childrenPitchService.getChildrenPitchsByParent(
      idParentPitch
    );

    if (pitch.numberPitch === childrenPitchs.length) {
      return res
        .status(400)
        .json(badRequest(400, "Đã tạo đủ số lượng sân đăng ký !!!"));
    }

    const childrentPitch = await childrenPitchService.create(req.body);
    if (!childrentPitch) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    res.status(200).json(successfully(childrentPitch, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const { error } = chilrenPitchValdation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const childrenPitch = await childrenPitchService.update(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!childrenPitch) {
      return res
        .status(400)
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }
    res
      .status(200)
      .json(successfully(childrenPitch, "Cập nhật thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const childrenPitch = await childrenPitchService.remove(req.params.id);
    if (!childrenPitch) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }
    res.status(200).json(successfully(childrenPitch, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
