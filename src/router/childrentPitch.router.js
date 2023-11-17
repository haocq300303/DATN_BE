import express from "express";
import { childrentPitchController } from "../controllers";
const routerChildrentPitch = express.Router();

// Get All
routerChildrentPitch.get("/", childrentPitchController.getAll);

// Get One
routerChildrentPitch.get("/:id", childrentPitchController.getByID);

// Create
routerChildrentPitch.post("/", childrentPitchController.create);

// Update
routerChildrentPitch.put("/:id", childrentPitchController.update);

// Delete
routerChildrentPitch.delete("/:id", childrentPitchController.remove);

// Get ChildrenPitchs By Parent
routerChildrentPitch.get(
  "/parent/:id",
  childrentPitchController.getChildrenPitchsByParent
);

export default routerChildrentPitch;
