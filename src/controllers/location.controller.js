import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import { locationService, pitchService } from "../services";
import { locationValidation } from "../validations";

export const getAll = async (req, res) => {
  try {
    const locations = await locationService.getAllLocation();

    if (!locations || locations.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    res.status(200).json(successfully(locations, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const getById = async (req, res) => {
  try {
    const location = await locationService.getOneLocation(req.params.id);
    if (!location) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    const pitch = await pitchService.getAllPitch({
      location_id: req.params.id,
    });

    const data = {
      location: {
        ...location.toObject(),
        pitchs: pitch,
      },
    };

    return res.status(200).json(successfully(data, "Lấy dữ liệu thành công"));
  } catch (error) {
    return res.status(500).json(serverError(error.message));
  }
};

export const create = async (req, res) => {
  try {
    const { error } = locationValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const location = await locationService.creatLocation(req.body);
    if (!location) {
      return res.status(400).json(badRequest(400, "Thêm không thành công !!!"));
    }
    res.status(200).json(successfully(location, "Thêm thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const update = async (req, res) => {
  try {
    const { error } = locationValidation.default.validate(req.body);
    if (error) {
      return res.status(400).json(badRequest(400, error.details[0].message));
    }
    const location = await locationService.updateLocation({
      ...req.body,
      id: req.params.id,
    });
    if (!location) {
      return res.status(400).json(badRequest(400, "Sửa không thành công !!!"));
    }
    res.status(200).json(successfully(location, "Sửa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

export const remove = async (req, res) => {
  try {
    const location = await locationService.deleteLocation(req.params.id);
    if (!location) {
      return res.status(400).json(badRequest(400, "Xóa không thành công !!!"));
    }
    res.status(200).json(successfully(location, "Xóa thành công !!!"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
