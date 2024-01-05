import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    admin_pitch_id: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    pitch_id: {
      type: mongoose.ObjectId,
      ref: "Pitch",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Service", serviceSchema);
