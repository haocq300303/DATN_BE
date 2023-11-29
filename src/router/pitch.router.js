import express from 'express';
import { pitchController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerPitch = express.Router();

// GET ALL
routerPitch.get('/', pitchController.getAll);
// GET ById
routerPitch.get('/:id', pitchController.getById);
// CREATE
routerPitch.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  pitchController.create
);
// UPDATE
routerPitch.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  pitchController.update
);
// DELETE
routerPitch.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdminPitch,
  pitchController.remove
);

export default routerPitch;
