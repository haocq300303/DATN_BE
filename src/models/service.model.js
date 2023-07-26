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
      default: null,
      type: mongoose.ObjectId,
      ref: "Pitch",
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