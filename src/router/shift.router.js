import express from "express";
import { shiftController } from "../controllers";
import { authMiddleware } from "../middlewares";

const routerShift = express.Router();

// Get All
routerShift.get("/", shiftController.getAll);

// Get One
routerShift.get("/:id", shiftController.getByID);

// Create
routerShift.post("/", authMiddleware.verifyToken, shiftController.create);

// Create Shift Default
routerShift.post(
  "/default",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.createShiftDefault
);

// Update
routerShift.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.update
);

// Update Shift Default
routerShift.put(
  "/default/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.updateShiftDefault
);

// Delete
routerShift.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.remove
);

// Delete Shift Default
routerShift.delete(
  "/default/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.deleteShiftDefault
);

// Find Opponent
routerShift.put(
  "/find-opponent/:id",
  authMiddleware.verifyToken,
  shiftController.find_opponent
);

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
routerShift.put(
  "/change-status-shift/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.changeStatusShift
);

// Get All Shift Default By Pitch
routerShift.get(
  "/default/pitch/:id",
  shiftController.getAllShiftDefaultByPitch
);

// Book multiple day
routerShift.post(
  "/book-multiple-day",
  authMiddleware.verifyToken,
  shiftController.bookMultipleDay
);

// Book One Shift Full Month
routerShift.post(
  "/book-one-shift-full-month",
  authMiddleware.verifyToken,
  shiftController.bookOneShiftFullMonth
);

// Book Children Picth Full Month
routerShift.post(
  "/book-childrenPicth-full-month",
  authMiddleware.verifyToken,
  shiftController.bookChildrenPicthFullMonth
);

// get Shift Booked By ChildPitch And NumberShift
routerShift.get(
  "/shift-booked/child-pitch-number-shift/:id",
  shiftController.getShiftBookedByChildPitchAndNumberShift
);

// Get Shifts By ChirldrenPitch Booking Month
routerShift.get(
  "/childrent-pitch/booking-month/:id",
  shiftController.getShiftsByChirldrenPitchBookingMonth
);

// Get Shifts By Pitch
routerShift.get("/pitch/:id", shiftController.getShiftsByPitch);

// Cancel Booking
routerShift.put(
  "/cancel-booking/:id",
  authMiddleware.verifyToken,
  shiftController.cancelBooking
);

export default routerShift;
