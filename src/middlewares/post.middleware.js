import Comment from "../models/comment.model";

export const deleteComments = async function (next) {
  try {
    const { _id: id_post } = this.getFilter();
    await Comment.deleteMany({ id_post });
    next();
  } catch (err) {
    next(err);
  }
};
