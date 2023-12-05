import jwt from 'jsonwebtoken';
import { roleService } from '../services';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
      if (error) {
        return res.status(401).json({
          error: true,
          message: 'Token is not valid!',
        });
      }
      req.user = user;
      console.log(user);
      next();
    });
  } else {
    res.status(403).json({
      error: true,
      message: "You're not authenticated",
    });
  }
};

export const verifyAdminPitch = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRETKEY, async (error, user) => {
      if (error) {
        return res.status(401).json({
          error: true,
          message: 'Token is not valid!',
        });
      }
      const role = await roleService.getById(user.role_id);
      if (role?.name === 'adminPitch') {
        next();
      } else {
        return res.status(402).json({
          error: true,
          message: 'You do not have permission',
        });
      }
    });
  } else {
    res.status(403).json({
      error: true,
      message: "You're not authenticated",
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRETKEY, async (error, user) => {
      if (error) {
        return res.status(401).json({
          error: true,
          message: 'Token is not valid!',
        });
      }
      const role = await roleService.getById(user.role_id);
      if (role?.name === 'admin') {
        next();
      } else {
        return res.status(402).json({
          error: true,
          message: 'You do not have permission',
        });
      }
    });
  } else {
    res.status(403).json({
      error: true,
      message: "You're not authenticated",
    });
  }
};
