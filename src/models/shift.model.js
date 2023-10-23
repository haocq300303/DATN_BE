import mongoose from "mongoose";
const shiftSchema = new mongoose.Schema(
  {
    shift_name: {
      type: Number,
      min: 1,
      required: true,
      unique: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    statusPitch: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
export default mongoose.model("Shift", shiftSchema);
