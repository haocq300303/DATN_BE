import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { transporter } from "../utils/sendEmail";
import { emailService } from "../services";
import { emailValidation } from "../validations";
import "dotenv/config";

export const getAll = async (req, res) => {
  try {
    const emails = await emailService.getAll();
    if (!emails) {
      return res.status(400).json(badRequest(400, "Lấy dữ liệu thất bại"));
    }
    res.status(200).json(successfully(emails, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getById = async (req, res) => {
  try {
    const email = await emailService.getById(req.params.id);
    if (!email) {
      return res.status(400).json(badRequest(400, "Lấy dữ liệu thất bại"));
    }
    res.status(200).json(successfully(email, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  const { email_to, subject, content, html } = req.body;
  try {
    const { error } = emailValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }

    await transporter.sendMail({
      from: {
        name: "FSport",
        address: process.env.USER_EMAIL,
      },
      to: email_to,
      subject,
      text: content,
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
    ${html}
    </main>
    <footer>
      <p>© 2023 FSport</p>
    </footer>
  </div>
</body>
</html>`,
    });
    const email = await emailService.create(req.body);
    if (!email) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }
    res.status(200).json(successfully(email, "Send email thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const email = await emailService.update(req.params.id, req.body, {
      new: true,
    });
    if (!email) {
      return res
        .status(400)
        .json(badRequest(400, "Cập nhật không thành công !!!"));
    }
    res.status(200).json(successfully(email, "Cập nhật thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const email = await emailService.remove(req.params.id);
    if (!email) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }
    res.status(200).json(successfully(email, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
