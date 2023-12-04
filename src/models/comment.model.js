import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const commentSchema = new Schema(
  {
    id_user: { type: mongoose.ObjectId, ref: "User", require: true },
    content: { type: String, require: true },
    id_post: { type: mongoose.ObjectId, ref: "Post" },
  },
  { versionKey: false, timestamps: true }
);

commentSchema.plugin(mongoosePaginate);

export default mongoose.model("Comment", commentSchema);
