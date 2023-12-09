import Comment from "../models/comment.model";

export const getAllComment = (options) => {
  return Comment.paginate(
    {},
    {
      ...options,
      populate: ["id_user", "id_post"],
    }
  );
};

export const getComment = (idComment) => {
  return Comment.findById(idComment).populate("id_user");
};

export const getCommentByPost = (id_post) => {
  return Comment.find({ id_post });
};

export const createComment = (comment) => {
  return Comment.create(comment);
};

export const updateComment = (comment) => {
  const { idComment, ...data } = comment;
  return Comment.findByIdAndUpdate(idComment, data, { new: true });
};

export const deleteComment = (idComment) => {
  return Comment.findByIdAndDelete(idComment);
};
