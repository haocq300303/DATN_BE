import express from 'express';
import { shiftController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerShift = express.Router();

// Get All
routerShift.get('/', shiftController.getAll);

// Get One
routerShift.get('/:id', shiftController.getByID);

// Create
routerShift.post('/', authMiddleware.verifyAdminPitch, shiftController.create);

// Create Shift Default
routerShift.post(
  '/default',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.createShiftDefault
);

// Update
routerShift.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.update
);

// Update Shift Default
routerShift.put(
  '/default/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.updateShiftDefault
);

// Delete
routerShift.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.remove
);

// Delete Shift Default
routerShift.delete(
  '/default/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.deleteShiftDefault
);

// // Find Opponent

// routerShift.put("/find-opponent-change/:id", shiftController.changeFindOpponent);

routerShift.put(
  '/find-opponent/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.find_opponent
);
routerShift.put(
  '/find-opponent-change/:id',
  shiftController.changeFindOpponent
);


// Match Opponent
routerShift.post(
  '/match-opponent',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.matchOpponent
);

// Get All Shift Find Opponent
routerShift.get('/find-opponent/all', shiftController.getAllShiftFindOpponent);

// Get All Shift Find Opponent By Pitch
routerShift.get(
  '/find-opponent/pitch/:id',
  shiftController.getAllShiftFindOpponentByPitch
);

// Get All Shift By children Pitch
routerShift.get(
  '/childrent-pitch/:id',
  shiftController.getAllShiftByChirldrenPitch
);

// Change Status Shift
routerShift.put(
  '/change-status-shift/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.changeStatusShift
);

// Get All Shift Default By Pitch
routerShift.get(
  '/default/pitch/:id',
  shiftController.getAllShiftDefaultByPitch
);

// Book multiple day
routerShift.post(
  '/book-multiple-day',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  shiftController.bookMultipleDay
);

export default routerShift;
