import ServiceModel from "../models/service.model";
import Pitch from "../models/pitch.model";

export const getAll = async (query) => {
    return ServiceModel.find(query);
}

export const getOneService = async (serviceId) => {
  return ServiceModel.findById(serviceId).populate("admin_pitch_id");
};

export const addIdPitch = async (service) => {
  return Pitch.findByIdAndUpdate(service.pitch_id,{
    $addToSet: { services: service._id}
  })
};

export const removeIdPitch = async (service) => {
  return Pitch.findByIdAndUpdate(service?.pitch_id, {
    $pull: { services: service?.id },
  });
}

export const create = async (data) => {
  return await ServiceModel.create(data);
};

export const update = async (service) => {
  const { id, ...body } = service;
  return await ServiceModel.findByIdAndUpdate(service.id, body, { new: true });
};

export const remove = async (serviceId) => {
  return await ServiceModel.findByIdAndDelete(serviceId);
};
