import mongoose from "mongoose";

const childrenPitchSchema = new mongoose.Schema(
  {
    idParentPitch: {
      type: mongoose.ObjectId,
      ref: "Pitch",
      required: true,
    },
    code_chirldren_pitch: {
      type: Number,
      min: 1,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },

  { timestamps: true, versionKey: false }
);

export default mongoose.model("ChildrenPitch", childrenPitchSchema);
