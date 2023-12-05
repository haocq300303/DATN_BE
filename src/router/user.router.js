import express from 'express';
import { userController } from '../controllers';

const routerUser = express.Router();

// GET ALL
routerUser.get('/users', userController.getList);

// GET BY ID
routerUser.get('/users/:id', userController.getById);

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
routerUser.put('/users/:id', userController.update);

// DELETE
routerUser.delete('/users/:id', userController.remove);

export default routerUser;
