import express from "express";
import { shiftController } from "../controllers";

const routerShift = express.Router();

// Get All
routerShift.get("/", shiftController.getAll);

// Get One
routerShift.get("/:id", shiftController.getByID);

// Create
routerShift.post("/", shiftController.create);

// Create Shift Default
routerShift.post("/default", shiftController.createShiftDefault);

// Update
routerShift.put("/:id", shiftController.update);

// Update Shift Default
routerShift.put("/default/:id", shiftController.updateShiftDefault);

// Delete
routerShift.delete("/:id", shiftController.remove);

// Delete Shift Default
routerShift.delete("/default/:id", shiftController.deleteShiftDefault);

// Find Opponent
routerShift.put("/find-opponent/:id", shiftController.find_opponent);
// Find Opponent
routerShift.put("/find-opponent-change/:id", shiftController.changeFindOpponent);

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

// Get All Shift Default By Pitch
routerShift.get(
  "/default/pitch/:id",
  shiftController.getAllShiftDefaultByPitch
);

// Book multiple day
routerShift.post("/book-multiple-day", shiftController.bookMultipleDay);

export default routerShift;
