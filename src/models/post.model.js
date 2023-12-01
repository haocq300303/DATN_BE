import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { postMiddleware } from "../middlewares";

const postSchema = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    images: [{ type: String, required: true }],
    comment_id: [{ type: mongoose.ObjectId, ref: "Comment" }],
  },
  { versionKey: false, timestamps: true }
);

postSchema.plugin(mongoosePaginate);

postSchema.pre("findOneAndDelete", postMiddleware.deleteComments);

export default mongoose.model("Post", postSchema);
