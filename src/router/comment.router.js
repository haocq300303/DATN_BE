import express from 'express';
import { commentController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerComment = express.Router();

// Get All Comment
routerComment.get('/', commentController.getAllComment);

// Get One Comment
routerComment.get('/:idComment', commentController.getComment);

// Get Comment By Post
routerComment.get('/post/:idPost', commentController.getCommentByPost);

// Create Comment
routerComment.post(
  '/',
  authMiddleware.verifyToken,
  commentController.createComment
);

// Update Comment
routerComment.put(
  '/:idComment',
  authMiddleware.verifyToken,
  commentController.updateComment
);

// Delete Comment
routerComment.delete(
  '/:idComment',
  authMiddleware.verifyToken,
  commentController.deleteComment
);

export default routerComment;
