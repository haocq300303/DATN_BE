import express from 'express';
import { otpController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerOtp = express.Router();

// GET ALL
routerOtp.get('/', authMiddleware.verifyToken, otpController.getAll);

// GET BY ID
routerOtp.get('/:id', authMiddleware.verifyToken, otpController.getById);

// CREATE
routerOtp.post('/', authMiddleware.verifyToken, otpController.create);

// UPDATE
routerOtp.put('/:id', authMiddleware.verifyToken, otpController.update);

// DELETE
routerOtp.delete('/:id', authMiddleware.verifyToken, otpController.remove);

export default routerOtp;
