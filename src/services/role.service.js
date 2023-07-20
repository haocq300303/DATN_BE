import Role from "../models/role.model";

export const getAll = async () => {
  return Role.find().populate("permissions");
};

export const getById = async (id) => {
  return Role.findById(id).populate("permissions");
};

export const create = async (data) => {
  return Role.create(data);
};

export const update = async (id, data) => {
  return Role.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const remove = async (id) => {
  return Role.findByIdAndDelete(id);
};
