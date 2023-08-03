import Feedback from "../models/feedback.model";

export const getAllFeedback = (options) => {
  return Feedback.paginate(
    {},
    {
      ...options,
      populate: ["id_user"],
    }
  );
};

export const createFeedback = (feedback) => {
  return Feedback.create(feedback);
};

export const updateFeedback = (feedback) => {
  const { idFeedback, ...data } = feedback;
  return Feedback.findByIdAndUpdate(idFeedback, data, { new: true });
};

export const deleteFeedback = (idFeedback) => {
  return Feedback.findByIdAndDelete(idFeedback);
};
