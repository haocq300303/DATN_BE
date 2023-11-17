import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { shiftService, userService } from "../services";
import { shiftValidation } from "../validations";
import { transporter } from "../utils/sendEmail";
import "dotenv/config";
import { endOfDay, format, parseISO, startOfDay, startOfToday } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const getAll = async (req, res) => {
  try {
    const shifts = await shiftService.getAll();
    if (!shifts || shifts.length === 0) {
      return res.status(404).json(badRequest(400, "Không có dữ liệu!"));
    }

    const newShifts = shifts.map((item) => ({
      ...item._doc,
      date: format(item.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    }));

    res.status(200).json(successfully(newShifts, "lấy dữ liệu thành công"));
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

    const newShift = {
      ...shift._doc,
      date: format(shift.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    };
    res.status(200).json(successfully(newShift, "lấy dữ lệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  try {
    const { date, ...data } = req.body;
    const vietnamTimeZone = "Asia/Ho_Chi_Minh";
    const newDate = format(
      utcToZonedTime(parseISO(date), vietnamTimeZone),
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );

    const existingShifts = await shiftService.getListByOptions({
      field: "date",
      payload: {
        $gte: startOfDay(parseISO(date)),
        $lt: endOfDay(parseISO(date)),
      },
    });

    // Kiểm tra xem đã có đủ 6 ca chưa
    if (existingShifts.length >= 6) {
      return res
        .status(400)
        .json(
          badRequest(400, "Không thể tạo thêm ca vì đã đạt 6 ca cho ngày này.")
        );
    }

    const newData = {
      date: newDate,
      ...data,
    };

    const { error } = shiftValidation.default.validate(newData);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const shift = await shiftService.creat(newData);

    if (!shift) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }

    const formattedDate = format(shift.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    const newShift = { ...shift._doc, date: formattedDate };

    res.status(200).json(successfully(newShift, "Thêm thành công !!!"));
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
    const newShift = {
      ...shift._doc,
      date: format(shift.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    };
    res.status(200).json(successfully(newShift, "Cập nhật thành công !!!"));
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

    const shift = await shiftService.update(shift_id, req.body);

    if (!shift) {
      return res.status(400).json(badRequest(400, "Cập nhật thất bại!"));
    }
    const newShift = {
      ...shift._doc,
      date: format(shift.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    };
    res
      .status(200)
      .json(successfully(newShift, "Thay đổi dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getAllShiftFindOpponent = async (req, res) => {
  try {
    const data = await shiftService.getListByOptions({
      field: "find_opponent",
      payload: "Find",
    });

    if (!data || data.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }
    const newShifts = data.map((item) => ({
      ...item._doc,
      date: format(item.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    }));

    res.status(200).json(successfully(newShifts, "Lấy dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getAllShiftFindOpponentByPitch = async (req, res) => {
  try {
    const { id: id_pitch } = req.params;

    const data = await shiftService.getListByOptions({
      field: "id_pitch",
      payload: id_pitch,
    });

    if (!data || data.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    const newData = data.filter((item) => item.find_opponent === "Find");

    const newShifts = newData.map((item) => ({
      ...item._doc,
      date: format(item.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    }));

    res.status(200).json(successfully(newShifts, "Lấy dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const matchOpponent = async (req, res) => {
  try {
    const { idUserFindOpponent, email, phone_number, nameUserFindOpponent } =
      req.body;
    // const { _id: id_user } = req.user;
    const id_user = "653cab898630200154dbe229";
    const currentUser = await userService.getById(id_user);

    if (id_user !== idUserFindOpponent) {
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
            subject: "Đã tìm được đối sân bóng!",
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
          <p>Xin chào ${nameUserSendEmail},</p><p>Bạn đã tìm được đối bóng.</p><p>Thông tin liên lạc: Họ và Tên: ${name}  -  SĐT: ${phone_number}</p><p>Vui lòng liên lạc cho đối thủ của bạn để xác nhận</p>
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
          meassge: "Gửi Email thành công!",
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

    const shifts = await shiftService.getListByOptions({
      field: "$and",
      payload: [
        { date: { $gte: formattedStartDate, $lt: formattedEndDate } },
        { id_chirlden_pitch },
      ],
    });

    if (!shifts || shifts.length === 0) {
      return res.status(404).json(badRequest(400, "Không có dữ liệu!"));
    }

    const newShifts = shifts.map((item) => ({
      ...item._doc,
      date: format(item.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    }));

    res.status(200).json(successfully(newShifts, "lấy dữ lệu thành công!"));
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
    const newShift = {
      ...shift._doc,
      date: format(shift.date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    };
    res
      .status(200)
      .json(successfully(newShift, "Thay đổi dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
