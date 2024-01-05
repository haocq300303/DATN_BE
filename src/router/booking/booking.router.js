import express from "express";
import * as BookingController from "../../controllers/booking.controller";
import * as BookingValidation from "../../validations/booking.validation";

const bookingRouter = express.Router();


bookingRouter.route("/affter-pay").post(BookingValidation.validation, BookingController.createAffterPay);
bookingRouter.route("/get-by-field").get(BookingController.getByField);
// bookingRouter.route("/getlist-by-userid").get(BookingController.getListByUserId);
bookingRouter
    .route("/:id")
    .get(BookingController.getById)
    .delete(BookingController.destroy)
    .put(BookingValidation.validation, BookingController.update);
bookingRouter.route("/").get(BookingController.getList).post(BookingValidation.validation, BookingController.create);

export default bookingRouter;

