import Pitch from "../models/pitch.model";

export const getAllPitch = async (options) => {
  return Pitch.paginate(
    {},
    {
      ...options,
      populate: ["admin_pitch_id", "services", "feedback_id"],
    }
  );
};
export const getServiceAdminPitch = async (idPitch) => {
  return Pitch.findById(idPitch).populate("services");
}
export const filterFeedbackPitch = async (options) => {
  console.log(options);
  return Pitch.paginate(
    {},
    {
      ...options,
      populate: ["feedback_id"],
    }
  );
};

export const getOnePitch = async (pitchId) => {
  try {
    const pitch = await Pitch.findById(pitchId).populate([
      "admin_pitch_id",
      "services",
    ]);

    if (!pitch) {
      throw new Error("Không tìm thấy sân bóng");
    }
    return pitch;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin sân bóng: ${error.message}`);
  }
};
export const getFeedbackPitch = (idPitch) => {
  return Pitch.findById(idPitch).populate([]);
};
export const getPitchByUser = (id_user) => {
  return Pitch.find({ admin_pitch_id: id_user }).populate(["admin_pitch_id", "services"]);
};
export const creatPitch = async (pitch) => {
  const product = new Pitch(pitch);
  return await product.save();
};
export const updatePitch = async (pitch) => {
  const { id, ...data } = pitch;
  return await Pitch.findByIdAndUpdate(pitch.id, data, { new: true }).populate(["admin_pitch_id", "services"]);
};
export const deletePitch = async (pitchId) => {
  return await Pitch.findByIdAndDelete(pitchId);
};
