import express from "express";
import { otpController } from "../controllers";

const routerOtp = express.Router();

// GET ALL
routerOtp.get("/", otpController.getAll);

// GET BY ID
routerOtp.get("/:id", otpController.getById);

// CREATE
routerOtp.post("/", otpController.create);

// UPDATE
routerOtp.put("/:id", otpController.update);

// DELETE
routerOtp.delete("/:id", otpController.remove);

export default routerOtp;
