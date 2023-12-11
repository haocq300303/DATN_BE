import express from "express";
import { serviceController } from "../controllers";
import { authMiddleware } from "../middlewares";

const routerService = express.Router();

// GET ALL
routerService.get("/", serviceController.getAll);



// CREATE
routerService.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  serviceController.create
);

// UPDATE
routerService.patch(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  serviceController.update
);

// REMOVE
routerService.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  serviceController.remove
);

export default routerService;
