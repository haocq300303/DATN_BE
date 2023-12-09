import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import moment from "moment";

const commentSchema = new Schema(
  {
    id_user: { type: mongoose.ObjectId, ref: "User", require: true },
    content: { type: String, require: true },
    id_post: { type: mongoose.ObjectId, ref: "Post" },
  },
  { versionKey: false, timestamps: true }
);
// Thêm trường ảo cho thời gian chuyển đổi
commentSchema.virtual('createdAtVietnam').get(function () {
  return moment(this.createdAt).utcOffset(7);
});

commentSchema.virtual('updatedAtVietnam').get(function () {
  return moment(this.updatedAt).utcOffset(7);
});

commentSchema.plugin(mongoosePaginate);

export default mongoose.model("Comment", commentSchema);
