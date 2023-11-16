import mongoose from "mongoose";
const shiftSchema = new mongoose.Schema({
  id_pitch: {
    type: mongoose.ObjectId,
    ref: "Pitch",
    require: true,
  },
  number_shift: {
    type: Number,
    require: true,
  },
  time_start: {
    type: String,
    required: true,
  },
  time_end: {
    type: String,
    required: true,
  },
  number_remain: {
    type: Number,
    // required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  statusPitch: {
    type: Boolean,
    default: false,
  },
  find_opponent: {
    type: Boolean,
    default: false,
  },
});
export default mongoose.model("Shift", shiftSchema);
