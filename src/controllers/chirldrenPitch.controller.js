import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import {childrenPitchService} from "../services";
import  {chilrenPitchValdation} from "../validations";
export const getAll = async (req, res) =>{
    try {
        const childrenPitchs = await childrenPitchService.getAll();
        if(!childrenPitchs) {
            return res.status(400).json(badRequest(400,"Không có sân nào cả"));
        }
        res.status(200).json(successfully(childrenPitchs,"lấy dữ lệu thành công"));
    } catch (error) {
        res.status(500).json(serverError(error.message));
    }
}

export const getByID = async (req, res) =>{
    try {
        const childrenPitch = await childrenPitchService.getById(req.params.id);
        if(!childrenPitch) {
            return res.status(400).json(badRequest(400,"Không có sân nào cả"));
        }
        res.status(200).json(successfully(childrenPitch,"lấy dữ lệu thành công"));
    } catch (error) {
         res.status(500).json(serverError(error.message))
    }
}


export const create = async (req, res) => {
    try {
      const { error } = chilrenPitchValdation.default.validate(req.body);
      if (error) {
        return res.status(400).json(badRequest(400, error.details[0].message));
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
      const childrenPitch = await childrenPitchService.update(req.params.id, req.body, {
        new: true,
      });
      if (!childrenPitch) {
        return res
          .status(400)
          .json(badRequest(400, "Cập nhật không thành công !!!"));
      }
      res.status(200).json(successfully(childrenPitch, "Cập nhật thành công !!!"));
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
  