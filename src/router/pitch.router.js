import express from "express";
import { pitchController } from "../controllers";

const routerPitch = express.Router();

// GET ALL
routerPitch.get("/", pitchController.getAll);
// GET ById
routerPitch.get("/:id", pitchController.getById);
// CREATE
routerPitch.post("/", pitchController.create);
// UPDATE
routerPitch.put("/:id", pitchController.update);
// DELETE
routerPitch.delete("/:id", pitchController.remove);

export default routerPitch;
