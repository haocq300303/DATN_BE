import ServiceModel from '../models/service.model';

export const getAll = async () => {
    return ServiceModel.find();
}