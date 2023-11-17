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
    id_Pitch: {
      type: mongoose.ObjectId,
      ref: "Pitches",
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