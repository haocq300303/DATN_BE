import express from "express";
import { shiftController } from "../controllers";

const routerShift = express.Router();

routerShift.get("/", shiftController.getAll);
routerShift.get("/:id", shiftController.getByID);
routerShift.post("/", shiftController.create);
routerShift.put("/:id", shiftController.update);
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

export default routerShift;
