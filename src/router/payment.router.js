import express from "express";
import * as PaymentController from "../controllers/payment.controller";
import * as PaymentValidation from "../validations/payment.validation";

const router = express.Router();

router
  .route("/:id")
  .get(PaymentController.getById)
  .delete(PaymentController.destroy)
  .put(PaymentValidation.validation, PaymentController.update);
router
  .route("/")
  .get(PaymentController.getList)
  .post(PaymentValidation.validation, PaymentController.create);

const paymentRouter = router;

export default paymentRouter;
