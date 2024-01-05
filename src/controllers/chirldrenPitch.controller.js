import { addDays, format, parse, subDays } from "date-fns";
import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { childrenPitchService, pitchService, shiftService } from "../services";
import { chilrenPitchValdation } from "../validations";

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

    const newDate = date ? date : format(new Date(), "yyyy-MM-dd");

    const dateObject = parse(newDate, "yyyy-MM-dd", new Date());
    // Lấy ngày 30 ngày trước
    const pastDate = subDays(dateObject, 29);
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    const childrenPitchs = await childrenPitchService.getChildrenPitchsByParent(
      idParentPitch
    );

    if (!childrenPitchs || childrenPitchs.length === 0) {
      return res.status(200).json(successfully([], "Không dữ liệu!"));
    }

    const shiftsDefault = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch: idParentPitch }],
    });

    if (!shiftsDefault || shiftsDefault.length === 0) {
      return res
        .status(200)
        .json(successfully(childrenPitchs, "Không dữ liệu!"));
    }

    const newChildrenPitchs = [];

    for (const childrenPitch of childrenPitchs) {
      try {
        const shifts = await shiftService.getListByOptions({
          field: "$and",
          payload: [
            { id_chirlden_pitch: childrenPitch._id },
            { isCancelBooking: { $ne: true } },
            {
              $or: [
                { date: { $in: [newDate] } },
                {
                  is_booking_month: true,
                  date: {
                    $elemMatch: {
                      $gte: formattedPastDate,
                      $lte: newDate,
                    },
                  },
                },
              ],
            },
          ],
        });

        const results = shiftsDefault.map((item) => ({
          ...item._doc,
          id_chirlden_pitch: childrenPitch._id,
          date: (
            shifts.find(
              (shift) =>
                shift.number_shift === item.number_shift ||
                shift.number_shift === null
            ) || item
          ).date,
          status_shift:
            !!shifts.find(
              (shift) =>
                shift.number_shift === item.number_shift ||
                shift.number_shift === null
            ) || false,
          default: !shifts.find(
            (shift) =>
              shift.number_shift === item.number_shift ||
              shift.number_shift === null
          ),
          _id: (
            shifts.find(
              (shift) =>
                shift.number_shift === item.number_shift ||
                shift.number_shift === null
            ) || item
          )._id,
          is_booking_month: (
            shifts.find(
              (shift) =>
                shift.number_shift === item.number_shift ||
                shift.number_shift === null
            ) || item
          ).is_booking_month,
        }));

        newChildrenPitchs.push({ ...childrenPitch._doc, shifts: results });
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
export const getChildrenPitchsByParentBookingMonth = async (req, res) => {
  try {
    const { id: idParentPitch } = req.params;
    const { date } = req.query;

    const newDate = date ? date : format(new Date(), "yyyy-MM-dd");

    const dateObject = parse(newDate, "yyyy-MM-dd", new Date());
    // Ngày sau 30 ngày
    const futureDate = addDays(dateObject, 29);
    // Lấy ngày 30 ngày trước
    const pastDate = subDays(dateObject, 29);
    const formattedCurrentDate = format(dateObject, "yyyy-MM-dd");
    const formattedFutureDate = format(futureDate, "yyyy-MM-dd");
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    const childrenPitchs = await childrenPitchService.getChildrenPitchsByParent(
      idParentPitch
    );

    if (!childrenPitchs || childrenPitchs.length === 0) {
      return res.status(400).json(badRequest(400, "Không dữ liệu!"));
    }

    const newChildrenPitchs = [];

    for (const childrenPitch of childrenPitchs) {
      const bookedShifts = await shiftService.getListByOptions({
        field: "$or",
        payload: [
          {
            id_chirlden_pitch: childrenPitch._id,
            isCancelBooking: { $ne: true },
            date: {
              $elemMatch: {
                $gte: formattedCurrentDate,
                $lte: formattedFutureDate,
              },
            },
          },
          {
            id_chirlden_pitch: childrenPitch._id,
            isCancelBooking: { $ne: true },
            date: {
              $elemMatch: {
                $gte: formattedPastDate,
                $lte: formattedCurrentDate,
              },
            },
            is_booking_month: true,
          },
        ],
      });

      if (bookedShifts && bookedShifts.length > 0) {
        newChildrenPitchs.push({ ...childrenPitch._doc, isBooking: true });
      } else {
        newChildrenPitchs.push({ ...childrenPitch._doc, isBooking: false });
      }
    }

    res
      .status(200)
      .json(successfully(newChildrenPitchs, "lấy dữ lệu thành công!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
