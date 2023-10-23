import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { shiftModelService } from "../services";
import { shiftValidation } from "../validations";
import Pitch from "../models/pitch.model";

export const getAll = async (req, res) => {
  try {
    const shifts = await shiftModelService.getAll();
    if (!shifts || shifts.length === 0) {
      return res.status(404).json(badRequest(400, "Không có dữ liệu!"));
    }
    res.status(200).json(successfully(shifts, "lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getByID = async (req, res) => {
  try {
    const shift = await shiftModelService.getById(req.params.id);
    if (!shift) {
      return res.status(400).json(badRequest(400, "Không có sân nào cả"));
    }
    res.status(200).json(successfully(shift, "lấy dữ lệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  try {
    const { id_pitch, ...data } = req.body;
    const { error } = shiftValidation.default.validate(data);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const shift = await shiftModelService.creat(data);

    if (!shift) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    await Pitch.findByIdAndUpdate(id_pitch, {
      $addToSet: { shifts: shift._id },
    });

    res.status(200).json(successfully(shift, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const { error } = shiftValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const shift = await shiftModelService.update(req.params.id, req.body, {
      new: true,
    });
    if (!shift) {
      return res
        .status(400)
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }
    res.status(200).json(successfully(shift, "Cập nhật thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const { id_pitch } = req.body;

    const shift = await shiftModelService.remove(req.params.id);
    if (!shift) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }

    await Pitch.findByIdAndUpdate(id_pitch, {
      $pull: { shifts: shift._id },
    });

    res.status(200).json(successfully(shift, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
