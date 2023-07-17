import Permission from "../models/permission.model";

export const getAll = async () => {
  return Permission.find();
};

export const getById = async (id) => {
  return Permission.findById(id);
};

export const create = async (data) => {
  return Permission.create(data);
};

export const update = async (id, data) => {
  return Permission.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const remove = async (id) => {
  return Permission.findByIdAndDelete(id);
};
