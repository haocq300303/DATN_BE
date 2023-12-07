import { badRequest } from "../formatResponse/badRequest";
import { serverError } from "../formatResponse/serverError";
import { successfully } from "../formatResponse/successfully";
import Pitch from "../models/pitch.model";
import { feedbackValidation } from "../validations";
import { feedbackService } from "../services";
import Feedback from "../models/feedback.model";
import moment from "moment";

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
    const feedbackWithVietnamTime = {
      ...feedbacks,
      data: feedbacks.data.map((feedback) => ({
        ...feedback.toObject(),
        createdAt: moment(feedback.createdAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
        updatedAt: moment(feedback.updatedAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
      })),
    };

    res.status(200).json(successfully(feedbackWithVietnamTime, "Lấy dữ liệu thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Create Feedback
export const createFeedback = async (req, res) => {
  // console.log("reqUsser:", req.user);
  try {
    const id_user = req.user._id;
    const id_pitch = req.body.id_pitch;
    // Kiểm tra xem id_user đã đánh giá id_pitch trước đó chưa
    const existingFeedback = await Feedback.findOne({ id_user, id_pitch });
    if (existingFeedback) {
      return res.status(400).json(badRequest(400, "Bạn đã đánh giá rồi!"));
    }

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
    // Cập nhật feedback_id trong Pitch
    await Pitch.findByIdAndUpdate(feedback.id_pitch, {
      $addToSet: { feedback_id: feedback._id },
    });

    const feedbackWithVietnamTime = {
      ...feedback.toObject(),
      createdAt: moment(feedback.createdAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
      updatedAt: moment(feedback.updatedAt).utcOffset(7).format('DD/MM/YYYY - HH:mm'),
      user: req.user,
    };
    res.status(200).json(successfully(feedbackWithVietnamTime, "Đánh giá thành công"));
  } catch (error) {
    res.status(500).json(serverError(error.message));
  }
};

// Tính tổng star user
export const totalStarByUser = async (req, res) => {
  try {
    const { id_pitch } = req.params;

    const feedbacks = await Feedback.find({ id_pitch });


    let totalQuantityStar = 0;
    feedbacks.forEach((feedback) => {
      totalQuantityStar += feedback.quantity_star;
    });

    const numberOfFeedbacks = feedbacks.length;
    const averageRating = numberOfFeedbacks > 0 ? totalQuantityStar / numberOfFeedbacks : 0;

    res.status(200).json(successfully({ averageRating }, "Tính tổng số lượng sao thành công"));
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

    const feedback = await feedbackService.getByOptions({
      field: "_id",
      payload: idFeedback,
    });

    if (!feedback && feedback.id_user !== id_user)
      return res.status(403).json(badRequest(403, "Không có quyền!"));

    const newFeedback = await feedbackService.updateFeedback({
      idFeedback,
      id_user,
      ...req.body,
    });

    if (!feedback) {
      return res.status(400).json(badRequest(400, "Sửa Đánh giá thất bại!"));
    }

    res.status(200).json(successfully(newFeedback, "Sửa Đánh giá thành công"));
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
