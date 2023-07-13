import Permission from "../models/permission.model";

export const getAll = async () => {
  return Permission.find();
};
