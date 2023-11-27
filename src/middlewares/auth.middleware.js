import jwt from 'jsonwebtoken';

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
