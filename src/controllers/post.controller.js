import { badRequest } from "../formatResponse/badRequest";
import { successfully } from "../formatResponse/successfully";
import { serverError } from "../formatResponse/serverError";
import { postValidation } from "../validations";
import { commentService, postService } from "../services";
import moment from "moment";


// Get All Post
export const getAllPost = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      _sort = "createdAt",
      _order = "desc",
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
    const postsWithVietnamTime = {
      ...posts,
      data: posts.data.map((post) => ({
        ...post.toObject(),
        createdAt: moment(post.createdAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
        updatedAt: moment(post.updatedAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
      })),
    };

    res.status(200).json(successfully(postsWithVietnamTime, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};


//Get One Post
export const getPost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const post = await postService.getPost(idPost);

    if (!post) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }
    const postOneWithVietnamTime = {
      ...post.toObject(),
      createdAt: moment(post.createdAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
      updatedAt: moment(post.updatedAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
    }
    res.status(200).json(successfully(postOneWithVietnamTime, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};


// Get One Post and Comment
export const getCommentPost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const post = await postService.getPost(idPost);

    if (!post) {
      return res.status(404).json(badRequest(404, 'Không có dữ liệu!'));
    }

    // Lấy dữ liệu của từng comment_id
    const commentData = await Promise.all(
      post.comment_id.map(async (commentId) => {
        const comment = await commentService.getComment(commentId);
        const commentWithVietnamTime = {
          _id: comment._id,
          id_user: comment.id_user,
          content: comment.content,
          id_post: comment.id_post,
          createdAt: moment(comment.createdAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
          updatedAt: moment(comment.updatedAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
        };
        return commentWithVietnamTime;
      })
    );

    // Gửi dữ liệu post và comments về client
    const formattedPost = {
      _id: post._id,
      title: post.title,
      description: post.description,
      images: post.images,
      comment_id: commentData,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res.status(200).json(successfully(formattedPost, 'Lấy dữ liệu thành công'));
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
    const { error } = postValidation.default.validate(
      { ...req.body },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(badRequest(400, errors));
    }

    const post = await postService.createPost({ ...req.body });
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

    const { error } = postValidation.default.validate(
      { ...req.body },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(badRequest(400, errors));
    }

    const post = await postService.updatePost({ idPost, ...req.body });

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
