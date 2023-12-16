import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    id_chirlden_pitch: {
      type: mongoose.ObjectId,
      ref: "ChildrenPitch",
    },
    id_pitch: {
      type: mongoose.ObjectId,
      ref: "Pitch",
      require: true,
    },
    number_shift: {
      type: Number,
      min: 1,
      // require: true,
    },
    start_time: {
      type: String,
      // required: true,
    },
    end_time: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status_shift: {
      type: Boolean,
    },
    date: [
      {
        type: String,
      },
    ],
    find_opponent: {
      type: String,
      enum: ["Find", "NotFind"],
      default: "NotFind",
    },
    default: {
      type: Boolean,
      default: false,
    },
    is_booking_month: {
      type: Boolean,
      default: false,
    },
    isCancelBooking: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.model("Shift", shiftSchema);
