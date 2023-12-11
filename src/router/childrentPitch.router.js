import express from "express";
import { childrentPitchController } from "../controllers";
import { authMiddleware } from "../middlewares";
const routerChildrentPitch = express.Router();

// Get All
routerChildrentPitch.get("/", childrentPitchController.getAll);

// Get One
routerChildrentPitch.get("/:id", childrentPitchController.getByID);

// Create
routerChildrentPitch.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  childrentPitchController.create
);

// Update
routerChildrentPitch.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  childrentPitchController.update
);

// Delete
routerChildrentPitch.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  childrentPitchController.remove
);

// Get ChildrenPitchs By Parent
routerChildrentPitch.get(
  "/parent/:id",
  childrentPitchController.getChildrenPitchsByParent
);

// Get ChildrenPitchs By Parent Booking Month
routerChildrentPitch.get(
  "/parent/booking-month/:id",
  childrentPitchController.getChildrenPitchsByParentBookingMonth
);

export default routerChildrentPitch;
