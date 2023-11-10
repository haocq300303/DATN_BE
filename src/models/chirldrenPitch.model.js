import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const childrenPitchSchema = new mongoose.Schema(
  {
    idParentPitch: {
      type: mongoose.ObjectId,
      ref: "Pitch",
      required: true,
    },
    code_chirldren_pitch: {
      type: Number,
    },
    idShifts:{
      type: Array,
      required: true,
    }
  },
  { timestamps: true, versionKey: false }
);

childrenPitchSchema.plugin(mongoosePaginate);

export default mongoose.model("ChildrenPitch", childrenPitchSchema);
