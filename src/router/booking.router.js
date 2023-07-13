import express from "express";
import * as BookingController from "../controllers/booking.controller";
import * as BookingValidator from "../validators/booking.validator";

const router = express.Router();

router.route("/:id").get(BookingController.getById).delete(BookingController.destroy).put(BookingValidator.validator, BookingController.update);
router.route("/").get(BookingController.getList).post(BookingValidator.validator, BookingController.create);

const bookingRouter = router;

export default bookingRouter;
