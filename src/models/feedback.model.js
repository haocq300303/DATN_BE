import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const feedbackSchema = new Schema(
  {
    id_user: { type: mongoose.ObjectId, ref: "User", require: true },
    id_pitch: { type: mongoose.ObjectId, ref: "Pitch", require: true },
    quantity_star: { type: Number, min: 1, max: 5, require: true },
  },
  { versionKey: false, timestamps: true }
);

feedbackSchema.plugin(mongoosePaginate);

export default mongoose.model("Feedback", feedbackSchema);
