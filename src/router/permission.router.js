import express from 'express';
import { permissionController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerPermission = express.Router();

// GET ALL
routerPermission.get(
  '/',
  authMiddleware.verifyToken,
  permissionController.getAll
);

// GET BY ID
routerPermission.get(
  '/:id',
  authMiddleware.verifyToken,
  permissionController.getById
);

// CREATE
routerPermission.post(
  '/',
  authMiddleware.verifyToken,
  permissionController.create
);

// UPDATE
routerPermission.put(
  '/:id',
  authMiddleware.verifyToken,
  permissionController.update
);

// DELETE
routerPermission.delete(
  '/:id',
  authMiddleware.verifyToken,
  permissionController.remove
);

export default routerPermission;
