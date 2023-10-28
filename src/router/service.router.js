import express from "express";
import { serviceController } from "../controllers";

const routerService = express.Router();

// GET ALL
routerService.get("/", serviceController.getAll);

// CREATE
routerService.post("/", serviceController.create);

// UPDATE
routerService.patch("/:id", serviceController.update);

// REMOVE
routerService.delete("/:id", serviceController.remove);

export default routerService;