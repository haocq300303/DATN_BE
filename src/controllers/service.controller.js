import { badRequest } from '../formatResponse/badRequest';
import { serverError } from '../formatResponse/serverError';
import { successfully } from '../formatResponse/successfully';
import { serviceValidation } from '../validations';
import * as serviceService from '../services/service.service';

export const getAll = async (req, res) => {
  try {
    const service = await serviceService.getAll(req.query);
    res.status(200).json(successfully(service, 'Lấy dữ liệu thành công'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getById = async (req, res) => {
  try {
    const { idUser } = req.params;
    const service = await serviceService.getAll();
    const results = service.filter((item) => item.admin_pitch_id === idUser);
    res.status(200).json(successfully(results, 'Lấy dữ liệu thành công'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  try {
    const { error } = serviceValidation.default.validate(req.body);

    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const service = await serviceService.create(req.body);
    await serviceService.addIdPitch(service);
    if (!service) {
      return res.status(400).json(badRequest(400, 'Thêm không thành công !!!'));
    }
    res.status(200).json(successfully(service, 'Thêm thành công !!!'));
    console.log(service);
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const { error } = serviceValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const service = await serviceService.update({
      id: req.params.id,
      ...req.body,
    });
    if (!service) {
      return res
        .status(400)
        .json(badRequest(400, 'Cập nhật không thành công !!!'));
    }
    res.status(200).json(successfully(service, 'Cập nhật thành công !!!'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const service = await serviceService.remove(req.params.id);
    if (!service) {
      return res.status(400).json(badRequest(400, 'Xóa không thành công !!!'));
    }
    await serviceService.removeIdPitch(service);
    res.status(200).json(successfully(service, 'Xóa thành công !!!'));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
