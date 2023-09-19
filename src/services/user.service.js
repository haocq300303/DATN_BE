import User from "../models/user.model";

export const getList = async (options) => {
  const { skip, limit, sort, ...params } = options;
  return await User.find(params).sort(sort).skip(skip).limit(limit);
};

export const countDocuments = async () => {
  return await User.countDocuments();
};

export const getById = async (id) => {
  return User.findById(id);
};

export const getByOptions = (options) => {
  const query = {
    [options.field]: options.payload,
  };
  return User.findOne(query);
};

export const create = (data) => {
  return User.create(data);
};

export const update = (id, data) => {
  return User.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const remove = (id) => {
  return User.findByIdAndDelete(id);
};
