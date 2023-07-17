import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import Comment from "../models/comment.model";
import Post from "../models/post.model";
import { commentSchemaValidation } from "../validations";
import { commentService } from "../services";

// Get All Comment
export const getAllComment = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
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

    const comments = await commentService.getAllComment(options);

    if (!comments || comments.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    res.status(200).json(successfully(comments, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Get One Comment
export const getComment = async (req, res) => {
  try {
    const { idComment } = req.params;
    const comment = await commentService.getComment(idComment);

    if (!comment) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }
    res.status(200).json(successfully(comment, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Get Comment By Post
export const getCommentByPost = async (req, res) => {
  try {
    const { idPost } = req.params;

    const comments = await commentService.getCommentByPost(idPost);

    if (!comments || comments.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }
    res.status(200).json(successfully(comments, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Create Comment
export const createComment = async (req, res) => {
  try {
    const { _id: id_user } = req.user;

    const { error } = commentSchemaValidation.default.validate(
      { id_user, ...req.body },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(badRequest(400, errors));
    }

    const comment = await commentService.createComment({
      id_user,
      ...req.body,
    });

    if (!comment) {
      return res.status(400).json(badRequest(400, "Bình luận thất bại!"));
    }

    await Post.findByIdAndUpdate(comment.id_post, {
      $addToSet: { comment_id: comment._id },
    });

    res.status(200).json(successfully(comment, "Bình luận thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Update Comment
export const updateComment = async (req, res) => {
  try {
    const { idComment } = req.params;
    const { _id: id_user } = req.user;

    const { error } = commentSchemaValidation.default.validate(
      { id_user, ...req.body },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(badRequest(400, errors));
    }

    const comment = await commentService.updateComment({
      idComment,
      id_user,
      ...req.body,
    });

    if (!comment) {
      return res.status(400).json(badRequest(400, "Sửa bình luận thất bại!"));
    }

    res.status(200).json(successfully(comment, "Sửa bình luận thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { idComment } = req.params;

    const comment = await commentService.deleteComment(idComment);

    if (!comment) {
      return res.status(400).json(badRequest(400, "Xóa bình luận thất bại!"));
    }

    await Post.findByIdAndUpdate(comment.id_post, {
      $pull: { comment_id: comment._id },
    });

    res.status(200).json(successfully(comment, "Xóa bình luận thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
