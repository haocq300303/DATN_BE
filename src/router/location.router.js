import express from "express";
import { locationController } from "../controllers";

const routerLocation = express.Router();

// GET ALL
routerLocation.get("/", locationController.getAll);
// GET ById
routerLocation.get("/:id", locationController.getById);
// CREATE
routerLocation.post("/", locationController.create);
// UPDATE
routerLocation.put("/:id", locationController.update);
// DELETE
routerLocation.delete("/:id", locationController.remove);

export default routerLocation;
