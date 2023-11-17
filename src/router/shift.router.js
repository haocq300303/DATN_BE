import express from "express";
import { shiftController } from "../controllers";

const routerShift = express.Router();

// Get All
routerShift.get("/", shiftController.getAll);

// Get One
routerShift.get("/:id", shiftController.getByID);

// Create
routerShift.post("/", shiftController.create);

// Update
routerShift.put("/:id", shiftController.update);

// Delete
routerShift.delete("/:id", shiftController.remove);

// Find Opponent
routerShift.put("/find-opponent/:id", shiftController.find_opponent);

// Match Opponent
routerShift.post("/match-opponent", shiftController.matchOpponent);

// Get All Shift Find Opponent
routerShift.get("/find-opponent/all", shiftController.getAllShiftFindOpponent);

// Get All Shift Find Opponent By Pitch
routerShift.get(
  "/find-opponent/pitch/:id",
  shiftController.getAllShiftFindOpponentByPitch
);

// Get All Shift By children Pitch
routerShift.get(
  "/childrent-pitch/:id",
  shiftController.getAllShiftByChirldrenPitch
);

// Change Status Shift
routerShift.put("/change-status-shift/:id", shiftController.changeStatusShift);

export default routerShift;
