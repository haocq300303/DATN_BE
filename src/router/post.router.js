import express from 'express';
import { postController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerPost = express.Router();

// Get All Post
routerPost.get('/', postController.getAllPost);

// Get One Post
routerPost.get('/:idPost', postController.getPost);
// Get One Post and comment
routerPost.get('/comment/:idPost', postController.getCommentPost);

// Get Post By User
routerPost.get('/user', postController.getPostByUser);

// Create Post
routerPost.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  postController.createPost
);

// Update Post
routerPost.put(
  '/:idPost',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  postController.updatePost
);

// Delete Post
routerPost.delete(
  '/:idPost',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  postController.deletePost
);

export default routerPost;
