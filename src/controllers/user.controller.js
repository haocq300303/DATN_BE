import { firebase } from "../config/firebase";
import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { otpService, userService } from "../services";
import { generateOtp } from "../utils/generateOtp";
import { generateToken } from "../utils/generateToken";
import { sendOtp } from "../utils/sendOtp";
import { userValidation } from "../validations";
import bcrypt from "bcryptjs";

export const getList = async (req, res) => {
  try {
    const {
      _sort = "createdAt",
      page = 1,
      limit = 10,
      _order = "desc",
      ...params
    } = req.query;
    const options = {
      skip: (page - 1) * limit,
      limit,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1,
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
      meassge: "Success",
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
      return res.status(400).json(badRequest(400, "Lấy dữ liệu thất bại"));
    }
    res.status(200).json(successfully(role, "Lấy dữ liệu thành công"));
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
      field: "email",
      payload: email,
    });
    if (!user) {
      return res
        .status(400)
        .json(badRequest(400, "Email không tồn tại trong hệ thống!!!"));
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(badRequest(400, "Mật khẩu không hợp lệ!!!"));
    }

    const token = await generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
    });
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
      field: "email",
      payload: decodedToken.email,
    });
    if (checkUser) {
      const token = await generateToken({
        id: checkUser.id,
        name: checkUser.name,
        email: checkUser.email,
      });
      return res.status(200).json({
        error: false,
        message: "Đăng nhập thành công",
        accessToken: token,
      });
    } else {
      const newUser = await userService.create({
        email: decodedToken.email,
        name: decodedToken.name,
      });
      const token = await generateToken({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });
      return res.status(200).json({
        error: false,
        message: "Đăng nhập thành công",
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
      const formatPhoneNumber = `+84${phoneNumber.slice(1, 10)}`;
      sendOtp(otpCode, formatPhoneNumber);
      const otp = await otpService.create({
        otp: otpCode,
        phone_number: phoneNumber,
        expireAt: otpExpiration,
      });
      if (otp) {
        return res.status(200).json({
          error: false,
          meassge:
            "Chúng tôi đã gửi một mã otp về số điện thoại của bạn, để xác minh rằng đây là số điện thoại của bạn hãy nhập mã xác minh.",
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
      field: "phone_number",
      payload: phone_number,
    });

    if (otpForUser.otp !== otpCode) {
      return res.status(400).json(badRequest(400, "Mã xác minh không hợp lệ"));
    } else if (otpForUser.expireAt < Date.now()) {
      return res.status(400).json(badRequest(400, "Mã xác minh đã hết hạn"));
    } else {
      return res.status(200).json({
        error: false,
        message: "Tài khoản đã xác minh thành công",
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
      field: "phone_number",
      payload: phone_number,
    });
    const { otpCode, otpExpiration } = generateOtp();
    const formatPhoneNumber = `+84${phone_number.slice(1, 10)}`;
    if (otpForUser) {
      await otpService.update(otpForUser.id, {
        otp: otpCode,
        expiresAt: otpExpiration,
      });
    }
    sendOtp(otpCode, formatPhoneNumber);
    return res.status(200).json({
      error: false,
      message: "Refetch mã otp thành công!",
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
    const { email, password, name } = req.body;
    // check name
    const checkNameUser = await userService.getByOptions({
      field: "name",
      payload: name,
    });
    if (checkNameUser) {
      return res
        .status(400)
        .json(badRequest(400, "Tên người dùng đã tồn tại trên hệ thống!!!"));
    }
    // check email
    const checkemail = await userService.getByOptions({
      field: "email",
      payload: email,
    });
    if (checkemail) {
      return res
        .status(400)
        .json(badRequest(400, "Địa chỉ email đã tồn tại trên hệ thống!!!"));
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userService.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(200).json(successfully(newUser, "Thêm thành công !!!"));
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
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }
    res.status(200).json(successfully(user, "Cập nhật thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const user = await userService.remove(req.params.id);
    if (!user) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }
    res.status(200).json(successfully(user, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
