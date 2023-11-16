import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import Pitch from "../models/pitch.model";
import { feedbackValidation } from "../validations";
import { feedbackService } from "../services";

// Get All Feedback
export const getAllFeedback = async (req, res) => {
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

    const feedbacks = await feedbackService.getAllFeedback(options);

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json(badRequest(404, "Không có dữ liệu!"));
    }

    res.status(200).json(successfully(feedbacks, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { _id: id_user } = req.user;

    const { error } = feedbackValidation.default.validate(
      { id_user, ...req.body },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(badRequest(400, errors));
    }

    const feedback = await feedbackService.createFeedback({
      id_user,
      ...req.body,
    });

    if (!feedback) {
      return res.status(400).json(badRequest(400, "Đánh giá thất bại!"));
    }

    await Pitch.findByIdAndUpdate(feedback.id_pitch, {
      $addToSet: { feedback_id: feedback._id },
    });

    res.status(200).json(successfully(feedback, "Đánh giá thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
  try {
    const { idFeedback } = req.params;
    const { _id: id_user } = req.user;

    const { error } = feedbackValidation.default.validate(
      { id_user, ...req.body },
      {
        abortEarly: false,
      }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(badRequest(400, errors));
    }

    const feedback = await feedbackService.updateFeedback({
      idFeedback,
      id_user,
      ...req.body,
    });

    if (!feedback) {
      return res.status(400).json(badRequest(400, "Sửa Đánh giá thất bại!"));
    }

    res.status(200).json(successfully(feedback, "Sửa Đánh giá thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { idFeedback } = req.params;

    const feedback = await feedbackService.deleteFeedback(idFeedback);

    if (!feedback) {
      return res.status(400).json(badRequest(400, "Xóa Đánh giá thất bại!"));
    }

    await Pitch.findByIdAndUpdate(feedback.id_pitch, {
      $pull: { feedback_id: feedback._id },
    });

    res.status(200).json(successfully(feedback, "Xóa Đánh giá thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};
