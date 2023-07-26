import express from 'express';
import { childrentPitchController } from '../controllers';
const routerChildrentPitch = express.Router();


routerChildrentPitch.get("/",childrentPitchController.getAll );
routerChildrentPitch.get("/:id",childrentPitchController.getByID);
routerChildrentPitch.post("/",childrentPitchController.create);
routerChildrentPitch.put("/:id",childrentPitchController.update);
routerChildrentPitch.delete("/:id",childrentPitchController.remove);


export default routerChildrentPitch;
