import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { shiftModelService, userService } from "../services";
import { shiftValidation } from "../validations";
import Pitch from "../models/pitch.model";
import { transporter } from "../utils/sendEmail";
import "dotenv/config";

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
    const { id_pitch } = req.body;
    const { error } = shiftValidation.default.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const shift = await shiftModelService.creat(req.body);

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

export const find_opponent = async (req, res) => {
  try {
    const { id: shift_id } = req.params;

    const shift = await shiftModelService.update(shift_id, req.body, {
      new: true,
    });

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
    const data = await shiftModelService.getListByOptions({
      field: "find_opponent",
      payload: true,
    });

    if (!data || data.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    res.status(200).json(successfully(data, "Lấy dữ liệu thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getAllShiftFindOpponentByPitch = async (req, res) => {
  try {
    const { id: id_pitch } = req.params;

    const data = await shiftModelService.getListByOptions({
      field: "id_pitch",
      payload: id_pitch,
    });

    if (!data || data.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    const newData = data.filter((item) => item.find_opponent === true);

    res.status(200).json(successfully(newData, "Lấy dữ liệu thành công !!!"));
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
