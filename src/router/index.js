import bookingRouter from "./booking.router";
import paymentRouter from "./payment.router";
import routerPermission from "./permission.router";
<<<<<<< HEAD
import routerBanner from "./banner.router";
import routerService from "./service.router";

export default function routes(app) {
    app.use("/api/bookings", bookingRouter);
    app.use("/api/payments", paymentRouter);
    app.use("/api/permissions", routerPermission);
    app.use("/api/banners", routerBanner);
    app.use("/api/services", routerService);
=======
import routerRole from "./role.router";

export default function routes(app) {
  app.use("/api/bookings", bookingRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/permissions", routerPermission);
  app.use("/api/roles", routerRole);
>>>>>>> developer
}
