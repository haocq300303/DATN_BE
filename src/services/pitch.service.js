import Pitch from "../models/pitch.model";

export const getAllPitch = async (data) => {
    return Pitch.find(data);
};
export const getOnePitch = async (pitchId) => {
    try {
        const pitch = await Pitch.findById(pitchId).populate("location_id");
        if (!pitch) {
            throw new Error("Không tìm thấy sân bóng");
        }
        return pitch;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin sân bóng: ${error.message}`);
    }
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
