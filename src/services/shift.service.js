import shiftModel from "../models/shift.model";

export const getAll = async () => {
    return shiftModel.find();
}
export const getById = async (id) => {
    return shiftModel.findById(id);
}
export const creat = async (data) => {
    return shiftModel.create(data);
}    
export const update = async (id,data) => {
    return shiftModel.findByIdAndUpdate(id,data,{new:true});
}
export const remove = async (id) =>{
    return shiftModel.findByIdAndDelete(id);
}