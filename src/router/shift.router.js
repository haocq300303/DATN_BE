import express from 'express';
import { shiftController } from '../controllers';

const routerShift = express.Router();

routerShift.get("/",shiftController.getAll);
routerShift.get("/:id",shiftController.getByID);
routerShift.post("/",shiftController.create);
routerShift.put("/:id",shiftController.update);
routerShift.delete("/:id",shiftController.remove);


export default routerShift;

