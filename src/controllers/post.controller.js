import { badRequest } from "../formatResponse/badRequest";
import { successfully } from "../formatResponse/successfully";
import { serverError } from "../formatResponse/serverError";
import Post from "../models/post.model";
import { postSchemaValidation } from "../validations";
import { postService } from "../services";

// Get All Post
export const getAllPost = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      _sort = "createdAt",
      _order = "asc",
      ...params
    } = req.query;

    const options = {
      page,
      limit,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1,
      },
      ...params,
      customLabels: {
        docs: "data",
      },
    };

    const posts = await postService.getAllPost(options);

    if (!posts || posts.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }
    res.status(200).json(successfully(posts, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Get One Post
export const getPost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const post = await postService.getPost(idPost);

    if (!post) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }
    res.status(200).json(successfully(post, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Get Post By User
export const getPostByUser = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const posts = await postService.getPostByUser(userId);

    if (!posts || posts.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }
    res.status(200).json(successfully(posts, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Create Post
export const createPost = async (req, res) => {
  try {
    const { _id: id_user } = req.user;

    const { error } = postSchemaValidation.default.validate(
      { id_user, ...req.body },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(badRequest(400, errors));
    }

    const post = await postService.createPost({ id_user, ...req.body });
    if (!post) {
      return res.status(400).json(badRequest(400, "Thêm dữ liệu thất bại!"));
    }

    res.status(200).json(successfully(post, "Thêm dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const { _id: id_user } = req.user;

    const { error } = postSchemaValidation.default.validate(
      { id_user, ...req.body },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(badRequest(400, errors));
    }

    const post = await postService.updatePost({ idPost, id_user, ...req.body });

    if (!post) {
      return res.status(400).json(badRequest(400, "Sửa dữ liệu thất bại!"));
    }

    res.status(200).json(successfully(post, "Sửa dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { idPost } = req.params;

    const post = await postService.deletePost(idPost);

    if (!post) {
      return res.status(400).json(badRequest(400, "Xóa dữ liệu thất bại!"));
    }

    res.status(200).json(successfully(post, "Xóa dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
