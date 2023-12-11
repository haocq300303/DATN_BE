import express from "express";
import * as BookingController from "../controllers/booking.controller";
import * as BookingValidation from "../validations/booking.validation";

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         // Các thuộc tính của đối tượng Booking
 *       example:
 *         // Ví dụ về một đối tượng Booking
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     tags:
 *       - bookings
 *     summary: Get list of bookings
 *     description: Retrieves a list of bookings
 *     operationId: getBookingList
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *     security:
 *       - petstore_auth:
 *           - write:bookings
 *           - read:bookings
 */
