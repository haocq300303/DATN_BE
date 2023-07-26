import express from "express";
import { commentController } from "../controllers";

const routerComment = express.Router();

// Get All Comment
routerComment.get("/", commentController.getAllComment);

// Get One Comment
routerComment.get("/:idComment", commentController.getComment);

// Get Comment By Post
routerComment.get("/post/:idPost", commentController.getCommentByPost);

// Create Comment
routerComment.post("/", commentController.createComment);

// Update Comment
routerComment.put("/:idComment", commentController.updateComment);

// Delete Comment
routerComment.delete("/:idComment", commentController.deleteComment);

export default routerComment;
