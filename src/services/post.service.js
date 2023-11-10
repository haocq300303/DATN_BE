import Post from "../models/post.model";

export const getAllPost = (options) => {
  return Post.paginate(
    {},
    {
      ...options,
      populate: ["comment_id", "id_user"],
    }
  );
};

export const getPost = (idPost) => {
  return Post.findById(idPost).populate(["comment_id", "id_user"]);
};

export const getPostByUser = (id_user) => {
  return Post.find({ id_user });
};

export const createPost = (post) => {
  return Post.create(post);
};

export const updatePost = (post) => {
  const { idPost, ...data } = post;
  return Post.findByIdAndUpdate(idPost, data, { new: true });
};

export const deletePost = (idPost) => {
  return Post.findByIdAndDelete(idPost);
};
