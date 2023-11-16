import express from "express";
import { locationController } from "../controllers";

const routerLocation = express.Router();

// GET ALL PROCINCE
routerLocation.get("/provinces", locationController.getAllProvince);

// GET ALL DISTRICT BY ID PROCINCE
routerLocation.get("/districts", locationController.getAllDistrictByParent);

// GET ALL WARDS BY ID DISTRICT
routerLocation.get("/wards", locationController.getAllwardByParent);

// GET ALL
routerLocation.get("/", locationController.getAll);

// GET ById
routerLocation.get("/:id", locationController.getById);

// CREATE
routerLocation.post("/", locationController.create);

// UPDATE
routerLocation.put("/:id", locationController.update);

// DELETE
routerLocation.delete("/:id", locationController.remove);

export default routerLocation;
