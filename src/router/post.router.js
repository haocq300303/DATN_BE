import express from "express";
import { postController } from "../controllers";

const routerPost = express.Router();

// Get All Post
routerPost.get("/", postController.getAllPost);

// Get One Post
routerPost.get("/:idPost", postController.getPost);

// Get Post By User
routerPost.get("/user", postController.getPostByUser);

// Create Post
routerPost.post("/", postController.createPost);

// Update Post
routerPost.put("/:idPost", postController.updatePost);

// Delete Post
routerPost.delete("/:idPost", postController.deletePost);

export default routerPost;
