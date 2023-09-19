import bookingRouter from "./booking.router";
import paymentRouter from "./payment.router";
import routerPermission from "./permission.router";
import routerRole from "./role.router";
import routerUser from "./user.router";
import routerOtp from "./otp.router";

export default function routes(app) {
  app.use("/api/bookings", bookingRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/permissions", routerPermission);
  app.use("/api/roles", routerRole);
  app.use("/api", routerUser);
  app.use("/api/otps", routerOtp);
}
