import Location from "../models/location.model";

export const getAllLocation = () => {
  return Location.find();
};
export const getOneLocation = async (locationId) => {
  return await Location.findById(locationId);
};
export const creatLocation = async (location) => {
  const product = new Location(location);
  return await product.save();
};
export const updateLocation = async (location) => {
  const { id, ...data } = location;
  return await Location.findByIdAndUpdate(location.id, data, { new: true });
};
export const deleteLocation = async (locationId) => {
  return await Location.findByIdAndDelete(locationId);
};
