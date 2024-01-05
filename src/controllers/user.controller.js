import { firebase } from '../config/firebase';
import { badRequest } from '../formatResponse/badRequest';
import { serverError } from '../formatResponse/serverError';
import { successfully } from '../formatResponse/successfully';
import { otpService, roleService, userService } from '../services';
import { generateOtp } from '../utils/generateOtp';
import { generateToken } from '../utils/generateToken';
import { sendOtp } from '../utils/sendOtp';
import { userValidation } from '../validations';
import bcrypt from 'bcryptjs';
import { endOfDay, startOfDay } from 'date-fns';
import BookingModel from '../models/booking.model';

export const getList = async (req, res) => {
  try {
    const {
      _sort = 'createdAt',
      page = 1,
      limit = 50,
      _order = 'desc',
      ...params
    } = req.query;
    const options = {
      skip: (page - 1) * limit,
      limit,
      sort: {
        [_sort]: _order === 'desc' ? -1 : 1,
      },
      ...params,
    };

    const [users, count] = await Promise.all([
      userService.getList(options),
      userService.countDocuments(),
    ]);

    res.status(200).json({
      error: false,
      statusCode: 200,
      meassge: 'Success',
      data: users,
      currentPage: page,
      totalPage: Math.ceil(count / limit),
      length: users.length,
    });
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getById = async (req, res) => {
  try {
    const role = await userService.getById(req.params.id);
    if (!role) {
      return res.status(400).json(badRequest(400, 'Lấy dữ liệu thất bại'));
    }
    res.status(200).json(successfully(role, 'Lấy dữ liệu thành công'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const login = async (req, res) => {
  try {
    const { error } = userValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    const { email, password } = req.body;

    // check if email exists
    const user = await userService.getByOptions({
      field: 'email',
      payload: email,
    });
    if (!user) {
      return res
        .status(400)
        .json(badRequest(400, 'Email không tồn tại trong hệ thống!!!'));
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json(badRequest(400, 'Mật khẩu không hợp lệ!!!'));
    }

    const role = await roleService.getById(user.role_id);
    const values = {
      _id: user._id,
      name: user.name,
      role_id: user.role_id,
      email: user.email,
      createAt: user.createdAt,
      updatedAt: user.updatedAt,
      role_name: role.name,
      phone_number: user.phone_number,
    };
    const token = await generateToken(values);
    res.status(200).json(successfully({ accessToken: token }));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const idToken = req.body.idToken;
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    let checkUser = await userService.getByOptions({
      field: 'email',
      payload: decodedToken.email,
    });
    const role = await roleService.getById(
      checkUser.role_id || '655b87021ac3962a68ccf1b5'
    );
    if (checkUser) {
      const values = {
        _id: checkUser._id,
        name: checkUser.name,
        role_id: checkUser.role_id,
        email: checkUser.email,
        createAt: checkUser.createdAt,
        updatedAt: checkUser.updatedAt,
        role_name: role.name,
      };
      const token = await generateToken(values);
      return res.status(200).json({
        error: false,
        message: 'Đăng nhập thành công',
        accessToken: token,
      });
    } else {
      const newUser = await userService.create({
        email: decodedToken.email,
        name: decodedToken.name,
        role_id: '655b87021ac3962a68ccf1b5',
      });
      const values = {
        _id: newUser._id,
        name: newUser.name,
        role_id: newUser.role_id,
        email: newUser.email,
        createAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        role_name: role.name,
      };
      const token = await generateToken(values);
      return res.status(200).json({
        error: false,
        message: 'Đăng nhập thành công',
        accessToken: token,
      });
    }
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const loginWithOtp = async (req, res) => {
  try {
    const phoneNumber = req.body.phone_number;
    const { otpCode, otpExpiration } = generateOtp();
    if (phoneNumber) {
      const checkUser = await userService.getByOptions({
        field: 'phone_number',
        payload: phoneNumber,
      });
      if (checkUser) {
        const formatPhoneNumber = `+84${phoneNumber.slice(1, 10)}`;
        sendOtp(otpCode, formatPhoneNumber);
        const checkOtp = await otpService.getByOptions({
          field: 'phone_number',
          payload: phoneNumber,
        });
        if (!checkOtp) {
          await otpService.create({
            otp: otpCode,
            phone_number: phoneNumber,
            expireAt: otpExpiration,
          });
        } else {
          await otpService.update(checkOtp.id, {
            otp: otpCode,
            expireAt: otpExpiration,
          });
        }
        return res.status(200).json({
          error: false,
          message:
            'Chúng tôi đã gửi một mã otp về số điện thoại của bạn, để xác minh rằng đây là số điện thoại của bạn hãy nhập mã xác minh.',
        });
      } else {
        return res.status(400).json({
          error: false,
          message: 'Người dùng không tồn tại trên hệ thống!!!',
        });
      }
    }
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone_number, otpCode } = req.body;
    const otpForUser = await otpService.getByOptions({
      field: 'phone_number',
      payload: phone_number,
    });

    if (otpForUser.otp !== otpCode) {
      return res.status(400).json(badRequest(400, 'Mã xác minh không hợp lệ'));
    } else if (otpForUser.expireAt < Date.now()) {
      return res.status(400).json(badRequest(400, 'Mã xác minh đã hết hạn'));
    } else {
      const userForPhone = await userService.getByOptions({
        field: 'phone_number',
        payload: phone_number,
      });
      const role = await roleService.getById(userForPhone.role_id);
      const values = {
        _id: userForPhone._id,
        name: userForPhone.name,
        role_id: userForPhone.role_id,
        email: userForPhone.email,
        createAt: userForPhone.createdAt,
        updatedAt: userForPhone.updatedAt,
        role_name: role.name,
      };
      const token = await generateToken(values);
      return res.status(200).json({
        error: false,
        message: 'Tài khoản đã xác minh thành công',
        accessToken: token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(serverError(error.message));
  }
};

export const refetchOtp = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const otpForUser = await otpService.getByOptions({
      field: 'phone_number',
      payload: phone_number,
    });
    const { otpCode, otpExpiration } = generateOtp();
    const formatPhoneNumber = `+84${phone_number.slice(1, 10)}`;
    if (otpForUser) {
      await otpService.update(otpForUser.id, {
        otp: otpCode,
        expireAt: otpExpiration,
      });
    }
    sendOtp(otpCode, formatPhoneNumber);
    return res.status(200).json({
      error: false,
      message:
        'Refetch mã otp thành công, hãy kiểm tra tin nhắn trong điện thoại của bạn!!!',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(serverError(error.message));
  }
};

export const register = async (req, res) => {
  try {
    const { error } = userValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const { email, password, phone_number, name, role_id } = req.body;
    // check name
    const checkNameUser = await userService.getByOptions({
      field: 'name',
      payload: name,
    });
    if (checkNameUser) {
      return res
        .status(400)
        .json(badRequest(400, 'Tên người dùng đã tồn tại trên hệ thống!!!'));
    }
    // check email
    const checkemail = await userService.getByOptions({
      field: 'email',
      payload: email,
    });
    if (checkemail) {
      return res
        .status(400)
        .json(badRequest(400, 'Địa chỉ email đã tồn tại trên hệ thống!!!'));
    }
    // check phone
    const checkphone = await userService.getByOptions({
      field: 'phone_number',
      payload: phone_number,
    });
    if (checkphone) {
      return res
        .status(400)
        .json(badRequest(400, 'Số điện thoại đã tồn tại trên hệ thống!!!'));
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userService.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      role_id: role_id ? role_id : '655b87021ac3962a68ccf1b5',
    });
    const values = {
      _id: newUser._id,
      name: newUser.name,
      role_id: newUser.role_id,
      phone_number,
      email: newUser.email,
      createAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    const token = await generateToken(values);
    res
      .status(200)
      .json(successfully({ ...values, token }, 'Thêm thành công !!!'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const registerWithOTP = async (req, res) => {
  try {
    const { phone_number, role_id } = req.body;
    const checkUser = await userService.getByOptions({
      field: 'phone_number',
      payload: phone_number,
    });
    if (checkUser) {
      return res
        .status(400)
        .json(badRequest(400, 'Số điện thoại đã tồn tại trên hệ thống!!!'));
    }

    await userService.create({
      name: phone_number,
      phone_number,
      role_id: role_id ? role_id : '655b87021ac3962a68ccf1b5',
    });

    const { otpCode, otpExpiration } = generateOtp();
    const formatPhoneNumber = `+84${phone_number.slice(1, 10)}`;
    sendOtp(otpCode, formatPhoneNumber);
    const checkOtp = await otpService.getByOptions({
      field: 'phone_number',
      payload: phone_number,
    });
    if (!checkOtp) {
      await otpService.create({
        otp: otpCode,
        phone_number: phone_number,
        expireAt: otpExpiration,
      });
    } else {
      await otpService.update(checkOtp.id, {
        otp: otpCode,
        expireAt: otpExpiration,
      });
    }
    return res.status(200).json({
      error: false,
      message:
        'Chúng tôi đã gửi một mã otp về số điện thoại của bạn, để xác minh rằng đây là số điện thoại của bạn hãy nhập mã xác minh.',
    });
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const { error } = userValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const user = await userService.update(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res
        .status(400)
        .json(badRequest(400, 'Cập nhật không thành công !!!'));
    }
    res.status(200).json(successfully(user, 'Cập nhật thành công !!!'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const user = await userService.remove(req.params.id);
    if (!user) {
      return res.status(400).json(badRequest(400, 'Xóa không thành công !!!'));
    }
    res.status(200).json(successfully(user, 'Xóa thành công !!!'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const bookingLimit = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    const { pitch_id } = req.query;

    const currentDate = new Date();

    const bookings = await BookingModel.find({
      user_id,
      pitch_id,
      createdAt: {
        $gte: startOfDay(currentDate),
        $lt: endOfDay(currentDate),
      },
      status: { $ne: 'cancel' },
    });

    res
      .status(200)
      .json(successfully(bookings, 'Check Booking Limit Success!'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password, new_password, user_id } = req.body;
    const checkUser = await userService.getById(user_id);
    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
      return res
        .status(200)
        .json(
          badRequest(
            400,
            'Mật khẩu hiện tại không chính xác, vui lòng nhập lại!'
          )
        );
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await userService.update(checkUser._id, {
      password: hashedPassword,
    });
    res.status(200).json(successfully([], 'Đổi mật khẩu thành công!'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
