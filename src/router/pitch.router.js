import express from 'express';
import { pitchController } from '../controllers';
import { authMiddleware } from '../middlewares';

const routerPitch = express.Router();

// GET ALL
routerPitch.get('/', pitchController.getAll);
// GET ById
routerPitch.get('/:id', pitchController.getById);
// GET ById and feedback
routerPitch.get('/feedback/:id', pitchController.getFeedbackPitch);
// GET PITCH USER
routerPitch.get(
    '/user/pitch',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdminPitch,
    pitchController.getPichByUser,
);
// CREATE

// GET ById and service
routerPitch.get("/service/:id", pitchController.getService);

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
routerPitch.delete("/:id", pitchController.remove);
//filter feedback
routerPitch.get("/filter/feedback", pitchController.filterFeedBack);


export default routerPitch;
