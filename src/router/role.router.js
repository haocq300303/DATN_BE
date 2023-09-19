import express from "express";
import { roleController } from "../controllers";

const routerRole = express.Router();

// GET ALL
routerRole.get("/", roleController.getAll);

// GET BY ID
routerRole.get("/:id", roleController.getById);

// CREATE
routerRole.post("/", roleController.create);

// UPDATE
routerRole.put("/:id", roleController.update);

// DELETE
routerRole.delete("/:id", roleController.remove);

export default routerRole;
