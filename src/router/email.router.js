import express from "express";
import { emailController } from "../controllers";

const routerEmail = express.Router();

// GET ALL
routerEmail.get("/", emailController.getAll);

// GET BY ID
routerEmail.get("/:id", emailController.getById);

// CREATE
routerEmail.post("/", emailController.create);

// UPDATE
routerEmail.put("/:id", emailController.update);

// DELETE
routerEmail.delete("/:id", emailController.remove);

export default routerEmail;
