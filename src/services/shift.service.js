import shiftModel from "../models/shift.model";

export const getAll = async () => {
  return shiftModel.find();
};
export const getListByOptions = (options) => {
  const query = {
    [options.field]: options.payload,
  };
  return shiftModel.find(query);
};
export const getListByOptionsPopulate = (options) => {
  const query = {
    [options.field]: options.payload,
  };
  return shiftModel.find(query).populate(["id_pitch", "id_chirlden_pitch"]);
};
export const getById = async (id) => {
  return shiftModel.findById(id).populate("id_pitch");
};
export const creat = async (data) => {
  return shiftModel.create(data);
};
export const update = async (id, data) => {
  return shiftModel.findByIdAndUpdate(id, data, { new: true });
};
export const remove = async (id) => {
  return shiftModel.findByIdAndDelete(id);
};
