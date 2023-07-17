import express from "express";
import { permissionController } from "../controllers";

const routerPermission = express.Router();

// GET ALL
routerPermission.get("/", permissionController.getAll);

// GET BY ID
routerPermission.get("/:id", permissionController.getById);

// CREATE
routerPermission.post("/", permissionController.create);

// UPDATE
routerPermission.put("/:id", permissionController.update);

// DELETE
routerPermission.delete("/:id", permissionController.remove);

export default routerPermission;
