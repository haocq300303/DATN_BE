import Pitch from "../models/pitch.model";

export const getAllLocation = async () => {
    return Pitch.find();
};
export const getOnePitch = async (pitchId) => {
    return await Pitch.findById(pitchId);
};
export const creatPitch = async (pitch) => {
    const product = new Pitch(pitch);
    return await product.save();
};
export const updatePitch = async (pitch) => {
    const { id, ...data } = pitch;
    return await Pitch.findByIdAndUpdate(pitch.id, data, { new: true });
};
export const deletePitch = async (pitchId) => {
    return await Pitch.findByIdAndDelete(pitchId);
};
