import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { postMiddleware } from "../middlewares";
import moment from "moment";

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
postSchema.virtual('createdAtVietnam').get(function () {
  return moment(this.createdAt).utcOffset(7);
});

postSchema.virtual('updatedAtVietnam').get(function () {
  return moment(this.updatedAt).utcOffset(7);
});

postSchema.pre("findOneAndDelete", postMiddleware.deleteComments);

export default mongoose.model("Post", postSchema);
