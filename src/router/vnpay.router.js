import express from "express";
import PayMentController from "../controllers/vnpay.controller";
import * as PaymentValidators from "../validations/vnpay.validator";

const routerPayment = express.Router();

routerPayment.post("/create-url", PaymentValidators.validation, PayMentController.createUrl);
routerPayment.get("/vnpay_ipn", PayMentController.getDataReturn);

export default routerPayment;
