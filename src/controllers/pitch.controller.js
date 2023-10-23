import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { pitchService } from "../services";
import { pitchValidation } from "../validations";
import Location from "../models/location.model";

export const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
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
    const pitchs = await pitchService.getAllPitch(options);
    console.log(pitchs);

    if (!pitchs || pitchs.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    res.status(200).json(successfully(pitchs, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getById = async (req, res) => {
  try {
    const pitch = await pitchService.getOnePitch(req.params.id);

    if (!pitch) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

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

    const pitch = await pitchService.creatPitch(req.body);
    if (!pitch) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    await Location.findByIdAndUpdate(pitch.location_id, {
      $addToSet: { pitchs: pitch._id },
    });

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
    const pitch = await pitchService.updatePitch({
      ...req.body,
      id: req.params.id,
    });
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

    await Location.findByIdAndUpdate(pitch.location_id, {
      $pull: { shifts: pitch._id },
    });

    res.status(200).json(successfully(pitch, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
