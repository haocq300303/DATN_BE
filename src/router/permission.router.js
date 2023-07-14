import express from "express";
import { permissionController } from "../controllers";

const routerPermission = express.Router();

// GET ALL
routerPermission.get("/", permissionController.getAll);

// CREATE
routerPermission.post("/", permissionController.create);

export default routerPermission;
