import { endOfDay, format, parseISO, startOfToday } from "date-fns";
import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { childrenPitchService, pitchService, shiftService } from "../services";
import { chilrenPitchValdation } from "../validations";
import { utcToZonedTime } from "date-fns-tz";

export const getAll = async (req, res) => {
  try {
    const childrenPitchs = await childrenPitchService.getAll();
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

    if (childrenPitchs.length >= pitch.numberPitch) {
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
      req.body
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

export const getChildrenPitchsByParent = async (req, res) => {
  try {
    const { id: idParentPitch } = req.params;
    const { date } = req.query;

    const vietnamTimeZone = "Asia/Ho_Chi_Minh";
    const newDate = date ? parseISO(date) : startOfToday(new Date());

    const formattedStartDate = format(
      utcToZonedTime(newDate, vietnamTimeZone),
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );

    const formattedEndDate = format(
      utcToZonedTime(endOfDay(newDate), vietnamTimeZone),
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );

    const childrenPitchs = await childrenPitchService.getChildrenPitchsByParent(
      idParentPitch
    );

    if (!childrenPitchs || childrenPitchs.length === 0) {
      return res.status(400).json(badRequest(400, "Không dữ liệu!"));
    }

    const shiftsDefault = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch: idParentPitch }],
    });

    if (!shiftsDefault || shiftsDefault.length === 0) {
      return res.status(404).json(badRequest(400, "Không có dữ liệu!"));
    }

    const newChildrenPitchs = [];

    for (const item of childrenPitchs) {
      try {
        const shifts = await shiftService.getListByOptions({
          field: "$and",
          payload: [
            { date: { $gte: formattedStartDate, $lt: formattedEndDate } },
            { id_chirlden_pitch: item._id },
          ],
        });

        const results = shiftsDefault.map((item) => ({
          ...item._doc,
          id_chirlden_pitch: item.id_chirlden_pitch,
          date: format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
          status_shift: !!shifts.find(
            (shift) => shift.number_shift === item.number_shift
          ),
          default: !shifts.find(
            (shift) => shift.number_shift === item.number_shift
          ),
          _id: (
            shifts.find((shift) => shift.number_shift === item.number_shift) ||
            item
          )._id,
        }));
        newChildrenPitchs.push({ ...item._doc, shifts: results });
      } catch (error) {
        return res.status(500).json(serverError(error.message));
      }
    }

    res
      .status(200)
      .json(successfully(newChildrenPitchs, "lấy dữ lệu thành công!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
