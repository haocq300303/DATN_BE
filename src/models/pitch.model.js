import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PitchSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    admin_pitch_id: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    numberPitch: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    services: [
      {
        type: mongoose.ObjectId,
        ref: "Service",
      },
    ],
    districts_id: {
      type: String,
      required: true,
    },
    location_id: {
      type: String,
      required: true,
    },
    average_price: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      required: true,
    },
    comment_id: [{ type: mongoose.ObjectId, ref: "Comment" }],
    feedback_id: [{ type: mongoose.ObjectId, ref: "Feedback" }],
  },
  { versionKey: false, timestamps: true }
);

PitchSchema.plugin(mongoosePaginate);

export default mongoose.model("Pitch", PitchSchema);
