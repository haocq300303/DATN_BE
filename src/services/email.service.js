import Email from "../models/email.model";

export const getAll = async () => {
  return Email.find();
};

export const getById = async (id) => {
  return Email.findById(id);
};

export const getByOptions = (options) => {
  const query = {
    [options.field]: options.payload,
  };
  return Email.findOne(query);
};

export const create = async (data) => {
  return Email.create(data);
};

export const update = async (id, data) => {
  return Email.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const remove = async (id) => {
  return Email.findByIdAndDelete(id);
};
