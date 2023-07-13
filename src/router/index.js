import bookingRouter from "./booking.router";
import paymentRouter from "./payment.router";
import routerPermission from "./permission.router";

export default function routes(app) {
    app.use("/api/bookings", bookingRouter);
    app.use("/api/payments", paymentRouter);
    app.use("/api/permissions", routerPermission);
}
