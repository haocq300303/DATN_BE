import express from "express";
import * as BookingController from "../controllers/booking.controller";
import * as BookingValidation from "../validations/booking.validation";

const router = express.Router();

router.route("/:id")
.get(BookingController.getById)
.delete(BookingController.destroy)
.put(BookingValidation.validation, BookingController.update);
router.route("/").get(BookingController.getList).post(BookingValidation.validation, BookingController.create);

const bookingRouter = router;

export default bookingRouter;
