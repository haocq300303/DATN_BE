import express from "express";
import { feedbackController } from "../controllers";

const routerFeedback = express.Router();

// Get All Feedback
routerFeedback.get("/", feedbackController.getAllFeedback);

// Create Feedback
routerFeedback.post("/", feedbackController.createFeedback);

// Update Feedback
routerFeedback.put("/:idFeedback", feedbackController.updateFeedback);

// Delete Feedback
routerFeedback.delete("/:idFeedback", feedbackController.deleteFeedback);

export default routerFeedback;
