import mongoose, { Schema } from "mongoose";

const LocationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    pitchs: [
      {
        type: mongoose.ObjectId,
        ref: "Pitch",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("Location", LocationSchema);
