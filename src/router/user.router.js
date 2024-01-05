import express from 'express';
import { userController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerUser = express.Router();

// GET ALL
routerUser.get('/users', authMiddleware.verifyToken, userController.getList);

// GET BY ID
routerUser.get(
  '/users/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  userController.getById
);

// LOGIN
routerUser.post('/login', userController.login);

// LOGIN WITH GOOGLE
routerUser.post('/login-google', userController.loginWithGoogle);

// LOGIN WITH PHONE NUMBER
routerUser.post('/login-otp', userController.loginWithOtp);

// VERIFY OTP
routerUser.post('/verify-otp', userController.verifyOtp);

// REFETCH OTP
routerUser.post('/refetch-otp', userController.refetchOtp);

// REGISTER
routerUser.post('/register', userController.register);

// REGISTER-OTP
routerUser.post('/register-otp', userController.registerWithOTP);

// UPDATE
routerUser.put('/users/:id', authMiddleware.verifyToken, userController.update);

// DELETE
routerUser.delete(
  '/users/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  userController.remove
);

// Change password
routerUser.post(
  '/re_password',
  authMiddleware.verifyToken,
  userController.changePassword
);

// Check Limit Booking
routerUser.get('/booking-limit/:id', userController.bookingLimit);

export default routerUser;
