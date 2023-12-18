import {
  addDays,
  differenceInMinutes,
  format,
  parse,
  subDays,
} from "date-fns";
import "dotenv/config";
import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { childrenPitchService, pitchService, shiftService } from "../services";
import { transporter } from "../utils/sendEmail";
import { shiftValidation } from "../validations";
import * as BookingService from "../services/booking.service";
import fs from "fs";
const locationJson = JSON.parse(fs.readFileSync("locations.json"));

export const getAll = async (req, res) => {
  try {
    const shifts = await shiftService.getAll();
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
    const shift = await shiftService.getById(req.params.id);
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
    const data = req.body;

    const { error } = shiftValidation.default.validate(data);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const newDate = new Date(data.date[0]);

    const pastDate = subDays(newDate, 30);

    const formattedCurrentDate = format(newDate, "yyyy-MM-dd");
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");
    const bookedShifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [
        {
          date: {
            $elemMatch: { $gte: formattedPastDate, $lte: formattedCurrentDate },
          },
        },
        { id_chirlden_pitch: data.id_chirlden_pitch },
        { is_booking_month: true },
        { isCancelBooking: { $ne: true } },
        {
          number_shift: {
            $in: [data.number_shift, null],
          },
        },
      ],
    });

    if (bookedShifts && bookedShifts.length > 0) {
      return res.status(400).json({
        error: true,
        statusCode: 400,
        message: "Ca bạn đặt đã được đặt trước đó!! Vui lòng chọn ca khác!!!",
        data: bookedShifts,
      });
    }

    const shift = await shiftService.creat(data);

    if (!shift) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    res.status(200).json(successfully(shift, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    // const { error } = shiftValidation.default.validate(req.body);
    // if (error) {
    //   return res.status(400).json(badRequest(400, error.details[0].message));
    // }
    const shift = await shiftService.update(req.params.id, req.body);
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
    const shift = await shiftService.remove(req.params.id);
    if (!shift) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }

    res.status(200).json(successfully(shift, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const find_opponent = async (req, res) => {
  try {
    const { id: shift_id } = req.params;
    const { find_opponent } = req.body;

    const shift = await shiftService.update(shift_id, { find_opponent });

    if (!shift) {
      return res.status(400).json(badRequest(400, "Cập nhật thất bại!"));
    }

    res
      .status(200)
      .json(successfully(shift, "Thay đổi dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getAllShiftFindOpponent = async (req, res) => {
  try {
    const { districtId, wardId } = req.query;
    const today = format(new Date(), "yyyy-MM-dd");

    const shifts = await shiftService.getListByOptionsPopulate({
      field: "$and",
      payload: [
        { find_opponent: "Find" },
        { isCancelBooking: { $ne: true } },
        { date: { $elemMatch: { $gte: today } } },
      ],
    });

    if (!shifts || shifts.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    const newShifts = [];

    for (const shift of shifts) {
      const bookingDb = await BookingService.getByField({
        shift_id: shift._id.toString(),
      });

      newShifts.push({ ...shift._doc, user: bookingDb?.user_booking });
    }

    let newData = [];
    if (districtId) {
      const wardIdsInDistricts = locationJson.wards
        .filter((ward) => ward.parent === districtId)
        .map((ward) => ward.id);

      const shiftsClone = newShifts.filter((item) =>
        wardIdsInDistricts.includes(item.id_pitch.location_id)
      );

      newData = [...shiftsClone];
    } else if (wardId) {
      const shiftsClone = newShifts.filter(
        (item) => item.id_pitch.location_id === wardId
      );
      newData = [...shiftsClone];
    } else {
      newData = [...newShifts];
    }

    res.status(200).json(successfully(newData, "Lấy dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getAllShiftFindOpponentByPitch = async (req, res) => {
  try {
    const { id: id_pitch } = req.params;

    const today = format(new Date(), "yyyy-MM-dd");

    const shifts = await shiftService.getListByOptionsPopulate({
      field: "$and",
      payload: [
        { id_pitch },
        { find_opponent: "Find" },
        { isCancelBooking: { $ne: true } },
        { date: { $elemMatch: { $gte: today } } },
      ],
    });

    if (!shifts || shifts.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    const newShifts = [];

    for (const shift of shifts) {
      const bookingDb = await BookingService.getByField({
        shift_id: shift._id.toString(),
      });

      newShifts.push({ ...shift._doc, user: bookingDb?.user_booking });
    }

    res.status(200).json(successfully(newShifts, "Lấy dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const matchOpponent = async (req, res) => {
  try {
    const {
      idUserFindOpponent,
      email,
      phone_number,
      nameUserFindOpponent,
      currentUserEmail,
      currentUserPhone,
      currentUserName,
      currentUserId,
    } = req.body;

    const currentUser = {
      _id: currentUserId,
      name: currentUserName,
      email: currentUserEmail,
      phone_number: currentUserPhone,
    };

    if (currentUser._id !== idUserFindOpponent) {
      if (email) {
        const sendEmail = async (
          nameUserSendEmail,
          email,
          name,
          phone_number
        ) => {
          await transporter.sendMail({
            from: {
              name: "FSport",
              address: process.env.USER_EMAIL,
            },
            to: email,
            subject: "Tìm được đối sân bóng!",
            text: `Chào ${nameUserSendEmail}. Bạn đã tìm được đối bóng. Họ và Tên: ${name}  -  SĐT: ${phone_number}. Vui lòng liên lạc để ghép kèo!`,
            html: `
            <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      
          header {
            background-color: #3498db;
            color: #ffffff;
            text-align: center;
            padding: 20px;
          }
      
          h1 {
            margin: 0;
          }
      
          main {
            padding: 20px;
          }
      
          p {
            margin-bottom: 20px;
          }
      
          button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
      
          footer {
            text-align: center;
            padding: 10px;
            background-color: #f1f1f1;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>FSport</h1>
          </header>
          <main>
          <p>Xin chào ${nameUserSendEmail},</p><p>Bạn đã tìm được đối bóng.</p><p>Thông tin liên lạc:</p><p>Họ và Tên: ${name}  -  SĐT: ${phone_number}</p><p>Vui lòng liên lạc cho đối thủ của bạn để xác nhận</p>
          </main>
          <footer>
            <p>© 2023 FSport</p>
          </footer>
        </div>
      </body>
      </html>`,
          });
        };

        // Gửi Email cho user ấn ghép kèo
        sendEmail(
          currentUser.name,
          currentUser.email,
          nameUserFindOpponent,
          phone_number
        );

        // Gửi Email cho user tìm kèo
        sendEmail(
          nameUserFindOpponent,
          email,
          currentUser.name,
          currentUser.phone_number
        );

        res.status(200).json({
          error: false,
          meassge: "Ghép kèo thành công!",
        });
      } else {
        res.status(400).json(badRequest(400, "Không có email!"));
      }
    } else {
      res
        .status(400)
        .json(badRequest(400, "Bạn không thể tự ghép kèo với mình!"));
    }
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getAllShiftByChirldrenPitch = async (req, res) => {
  try {
    const { id: id_chirlden_pitch } = req.params;
    const { date, id_pitch } = req.query;

    const newDate = date ? date : format(new Date(), "yyyy-MM-dd");

    const shiftsDefault = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch }],
    });

    if (!shiftsDefault || shiftsDefault.length === 0) {
      return res.status(404).json(badRequest(404, "Không có shifts default!"));
    }

    const dateObject = parse(newDate, "yyyy-MM-dd", new Date());
    // Lấy ngày 30 ngày trước
    const pastDate = subDays(dateObject, 29);

    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    const shifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [
        { id_chirlden_pitch },
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
      id_chirlden_pitch,
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

    res.status(200).json(successfully(results, "lấy dữ lệu thành công!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const changeStatusShift = async (req, res) => {
  try {
    const { id: shift_id } = req.params;
    const { status_shift } = req.body;

    const shift = await shiftService.update(shift_id, { status_shift });

    if (!shift) {
      return res.status(400).json(badRequest(400, "Cập nhật thất bại!"));
    }

    res
      .status(200)
      .json(successfully(shift, "Thay đổi dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const createShiftDefault = async (req, res) => {
  try {
    const data = req.body;

    const { error } = shiftValidation.default.validate(data);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const shift = await shiftService.creat(data);

    if (!shift) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    const shifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch: shift.id_pitch }],
    });

    const totalPrice = shifts.reduce((sum, shift) => sum + shift.price, 0);

    const averagePrice = totalPrice / shifts.length;

    await pitchService.updatePitch({
      id: shift.id_pitch,
      average_price: averagePrice,
    });

    res.status(200).json(successfully(shift, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const updateShiftDefault = async (req, res) => {
  try {
    // const { error } = shiftValidation.default.validate(req.body);
    // if (error) {
    //   return res.status(400).json(badRequest(400, error.details[0].message));
    // }
    const shift = await shiftService.update(req.params.id, req.body);
    if (!shift) {
      return res
        .status(400)
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }

    const shifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch: shift.id_pitch }],
    });

    const totalPrice = shifts.reduce((sum, shift) => sum + shift.price, 0);

    const averagePrice = totalPrice / shifts.length;

    await pitchService.updatePitch({
      id: shift.id_pitch,
      average_price: averagePrice,
    });

    res.status(200).json(successfully(shift, "Cập nhật thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const deleteShiftDefault = async (req, res) => {
  try {
    const shift = await shiftService.remove(req.params.id);
    if (!shift) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }

    const shifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch: shift.id_pitch }],
    });

    const totalPrice = shifts.reduce((sum, shift) => sum + shift.price, 0);

    const averagePrice = totalPrice / shifts.length;

    await pitchService.updatePitch({
      id: shift.id_pitch,
      average_price: averagePrice,
    });

    res.status(200).json(successfully(shift, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getAllShiftDefaultByPitch = async (req, res) => {
  try {
    const { id: id_pitch } = req.params;

    const shifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch }],
    });

    if (!shifts || shifts.length === 0) {
      return res.status(200).json(successfully([], "lấy dữ lệu thành công!"));
    }

    res.status(200).json(successfully(shifts, "lấy dữ lệu thành công!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const bookMultipleDay = async (req, res) => {
  try {
    const data = req.body;

    const { error } = shiftValidation.default.validate(data);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const bookedShifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [
        { date: { $in: data.date } },
        { isCancelBooking: { $ne: true } },
        { id_chirlden_pitch: data.id_chirlden_pitch },
        { number_shift: data.number_shift },
      ],
    });

    if (bookedShifts && bookedShifts.length > 0) {
      return res.status(400).json({
        error: true,
        statusCode: 400,
        message:
          "Trong số ca bạn đặt đã có ca được đặt trước đó!! Vui lòng chọn ca khác!!!",
        data: bookedShifts,
      });
    }

    // data.price = data.price * data.date.length;

    const shift = await shiftService.creat(data);

    if (!shift) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    res.status(200).json(successfully(shift, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const bookOneShiftFullMonth = async (req, res) => {
  try {
    const data = req.body;

    const { error } = shiftValidation.default.validate(data);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    // Ngày hiện tại
    const currentDate = new Date();

    // Ngày sau 30 ngày
    const futureDate = addDays(currentDate, 29);
    const pastDate = subDays(currentDate, 29);

    const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
    const formattedFutureDate = format(futureDate, "yyyy-MM-dd");
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    const bookedShifts = await shiftService.getListByOptions({
      field: "$or",
      payload: [
        {
          id_chirlden_pitch: data.id_chirlden_pitch,
          isCancelBooking: { $ne: true },
          number_shift: data.number_shift,
          date: {
            $elemMatch: {
              $gte: formattedCurrentDate,
              $lte: formattedFutureDate,
            },
          },
        },
        {
          id_chirlden_pitch: data.id_chirlden_pitch,
          isCancelBooking: { $ne: true },
          number_shift: data.number_shift,
          date: {
            $elemMatch: { $gte: formattedPastDate, $lte: formattedCurrentDate },
          },
          is_booking_month: true,
        },
      ],
    });

    if (bookedShifts && bookedShifts.length > 0) {
      return res.status(400).json({
        error: true,
        statusCode: 400,
        message:
          "Ca bạn đặt trong một tháng đã có ca được đặt trước!! Vui lòng chọn ca khác!!!",
        data: bookedShifts,
      });
    }

    data.date = [formattedCurrentDate];
    // data.price = data.price * 30;

    const shift = await shiftService.creat(data);

    if (!shift) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    res.status(200).json(successfully(shift, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const bookChildrenPicthFullMonth = async (req, res) => {
  try {
    const data = req.body;

    const { error } = shiftValidation.default.validate(data);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    // Ngày hiện tại
    const currentDate = new Date();

    // Ngày sau 30 ngày
    const futureDate = addDays(currentDate, 29);
    const pastDate = subDays(currentDate, 29);

    const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
    const formattedFutureDate = format(futureDate, "yyyy-MM-dd");
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    const bookedShifts = await shiftService.getListByOptions({
      field: "$or",
      payload: [
        {
          id_chirlden_pitch: data.id_chirlden_pitch,
          isCancelBooking: { $ne: true },
          date: {
            $elemMatch: {
              $gte: formattedCurrentDate,
              $lte: formattedFutureDate,
            },
          },
        },
        {
          id_chirlden_pitch: data.id_chirlden_pitch,
          isCancelBooking: { $ne: true },
          date: {
            $elemMatch: { $gte: formattedPastDate, $lte: formattedCurrentDate },
          },
          is_booking_month: true,
        },
      ],
    });

    if (bookedShifts && bookedShifts.length > 0) {
      return res.status(400).json({
        error: true,
        statusCode: 400,
        message:
          "Sân bạn đặt trong một tháng đã có ca đặt trước!! Vui lòng chọn sân khác!!!",
        data: bookedShifts,
      });
    }

    data.date = [formattedCurrentDate];

    const shift = await shiftService.creat(data);

    if (!shift) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    res.status(200).json(successfully(shift, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getShiftBookedByChildPitchAndNumberShift = async (req, res) => {
  try {
    const { id: id_chirlden_pitch } = req.params;
    const { number_shift } = req.query;

    // Ngày hiện tại
    const currentDate = new Date();

    // Ngày sau 30 ngày
    const futureDate = addDays(currentDate, 29);
    const pastDate = subDays(currentDate, 29);

    const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
    const formattedFutureDate = format(futureDate, "yyyy-MM-dd");
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    const shifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [
        { id_chirlden_pitch },
        { isCancelBooking: { $ne: true } },
        {
          number_shift: {
            $in: [number_shift, null],
          },
        },
        {
          $or: [
            {
              date: {
                $elemMatch: {
                  $gte: formattedCurrentDate,
                  $lte: formattedFutureDate,
                },
              },
            },
            {
              is_booking_month: true,
              date: {
                $elemMatch: {
                  $gte: formattedPastDate,
                  $lte: formattedCurrentDate,
                },
              },
            },
          ],
        },
      ],
    });

    res.status(200).json(successfully(shifts, "lấy dữ lệu thành công!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getShiftsByChirldrenPitchBookingMonth = async (req, res) => {
  try {
    const { id: id_chirlden_pitch } = req.params;
    const { date, id_pitch } = req.query;

    const newDate = date ? date : format(new Date(), "yyyy-MM-dd");

    const shiftsDefault = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch }],
    });

    if (!shiftsDefault || shiftsDefault.length === 0) {
      return res.status(404).json(badRequest(404, "Không có shifts default!"));
    }

    const dateObject = parse(newDate, "yyyy-MM-dd", new Date());

    // Ngày sau 30 ngày
    const futureDate = addDays(dateObject, 29);
    // Lấy ngày 30 ngày trước
    const pastDate = subDays(dateObject, 29);

    const formattedCurrentDate = format(dateObject, "yyyy-MM-dd");
    const formattedFutureDate = format(futureDate, "yyyy-MM-dd");
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    const shifts = await shiftService.getListByOptions({
      field: "$or",
      payload: [
        {
          id_chirlden_pitch,
          isCancelBooking: { $ne: true },
          date: {
            $elemMatch: {
              $gte: formattedCurrentDate,
              $lte: formattedFutureDate,
            },
          },
        },
        {
          id_chirlden_pitch,
          isCancelBooking: { $ne: true },
          date: {
            $elemMatch: { $gte: formattedPastDate, $lte: formattedCurrentDate },
          },
          is_booking_month: true,
        },
      ],
    });

    const results = shiftsDefault.map((item) => ({
      ...item._doc,
      id_chirlden_pitch,
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

    res.status(200).json(successfully(results, "lấy dữ lệu thành công!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getShiftsByPitch = async (req, res) => {
  try {
    const { id: id_pitch } = req.params;
    const { date } = req.query;

    const newDate = date ? date : format(new Date(), "yyyy-MM-dd");

    const childrenPitchs = await childrenPitchService.getChildrenPitchsByParent(
      id_pitch
    );

    if (!childrenPitchs) {
      return res.status(400).json(badRequest(400, "Không dữ liệu!"));
    }

    const shiftsDefault = await shiftService.getListByOptions({
      field: "$and",
      payload: [{ default: true }, { id_pitch }],
    });

    if (!shiftsDefault) {
      return res.status(404).json(badRequest(404, "Không có shifts default!"));
    }

    const dateObject = parse(newDate, "yyyy-MM-dd", new Date());
    // Lấy ngày 30 ngày trước
    const pastDate = subDays(dateObject, 29);
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    const newShifts = [];

    for (const childrenPitch of childrenPitchs) {
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
        id_chirlden_pitch: childrenPitch,
        id_pitch,
        date: (
          shifts.find(
            (shift) =>
              shift.number_shift === item.number_shift ||
              shift.number_shift === null
          ) || item
        ).date,
        start_time: (
          shifts.find((shift) => shift.number_shift === item.number_shift) ||
          item
        ).start_time,
        end_time: (
          shifts.find((shift) => shift.number_shift === item.number_shift) ||
          item
        ).end_time,
        price: (
          shifts.find(
            (shift) =>
              shift.number_shift === item.number_shift ||
              shift.number_shift === null
          ) || item
        ).price,
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
        find_opponent: (
          shifts.find((shift) => shift.number_shift === item.number_shift) ||
          item
        ).find_opponent,
        is_booking_month: (
          shifts.find(
            (shift) =>
              shift.number_shift === item.number_shift ||
              shift.number_shift === null
          ) || item
        ).is_booking_month,
      }));

      newShifts.push(...results);
    }

    res.status(200).json(successfully(newShifts, "lấy dữ lệu thành công!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id: shift_id } = req.params;
    const { id_booking } = req.query;
    const currentUser = req.user;

    const shift = await shiftService.getById(shift_id);
    if (!shift) {
      return res.status(400).json(badRequest(400, "Không có ca!!!"));
    }

    const shiftCreatedAt = shift.createdAt;
    const currentDateTime = new Date();

    const timeDifference = differenceInMinutes(currentDateTime, shiftCreatedAt);

    if (timeDifference > 30) {
      return res.status(400).json(badRequest(400, "Đã quá thời gian hủy!"));
    }

    const shiftUpdate = await shiftService.update(shift_id, {
      isCancelBooking: true,
    });

    await BookingService.update({
      id: id_booking,
      status: "cancel",
    });

    await transporter.sendMail({
      from: {
        name: "FSport",
        address: process.env.USER_EMAIL,
      },
      to: currentUser.email,
      subject: "Hủy lịch sân bóng thành công!",
      text: `Xin chào ${currentUser.name}. Bạn đã hủy lịch sân bóng ${
        shift.id_pitch.name
      } vào ${format(currentDateTime, "HH:mm:ss dd/MM/yyyy")}`,
      html: `
          <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title></title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        header {
          background-color: #3498db;
          color: #ffffff;
          text-align: center;
          padding: 20px;
        }

        h1 {
          margin: 0;
        }

        main {
          padding: 20px;
        }

        p {
          margin-bottom: 20px;
        }

        button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #3498db;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }

        footer {
          text-align: center;
          padding: 10px;
          background-color: #f1f1f1;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>FSport</h1>
        </header>
        <main>
        <p>Xin chào ${currentUser.name},</p><p>Bạn đã hủy lịch ca ${
        shift.number_shift
      } tại sân bóng ${shift.id_pitch.name} vào ${format(
        currentDateTime,
        "HH:mm:ss dd/MM/yyyy"
      )}</p><p>Trân trọng.</p>
        </main>
        <footer>
          <p>© 2023 FSport</p>
        </footer>
      </div>
    </body>
    </html>`,
    });

    res.status(200).json(successfully(shiftUpdate, "Hủy lịch thành công!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
