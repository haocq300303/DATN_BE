import express from "express";
import { bannerController } from "../controllers";


const routerBanner = express.Router();

// GET ALL
routerBanner.get("/", bannerController.getAll);


// GET ONE 
routerBanner.get("/:id", bannerController.getOne);


// CREATE
routerBanner.post("/", bannerController.create);

// UPDATE
routerBanner.patch("/:id", bannerController.update);

// REMOVE
routerBanner.delete("/:id", bannerController.remove);

export default routerBanner;