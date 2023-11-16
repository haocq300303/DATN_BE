import Otp from "../models/otp.model";

export const getAll = async () => {
  return Otp.find();
};

export const getById = async (id) => {
  return Otp.findById(id);
};

export const getByOptions = (options) => {
  const query = {
    [options.field]: options.payload,
  };
  return Otp.findOne(query);
};

export const create = async (data) => {
  return Otp.create(data);
};

export const update = async (id, data) => {
  return Otp.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const remove = async (id) => {
  return Otp.findByIdAndDelete(id);
};
