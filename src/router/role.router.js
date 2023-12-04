import express from 'express';
import { roleController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerRole = express.Router();

// GET ALL
routerRole.get('/', roleController.getAll);

// GET BY ID
routerRole.get('/:id', roleController.getById);

// CREATE
routerRole.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  roleController.create
);

// UPDATE
routerRole.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  roleController.update
);

// DELETE
routerRole.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  roleController.remove
);

export default routerRole;
