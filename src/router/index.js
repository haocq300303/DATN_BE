import bookingRouter from "./booking.router";
import routerChildrentPitch from "./childrentPitch.router";
import paymentRouter from "./payment.router";
import routerPermission from "./permission.router";
import routerPost from "./post.router";
import routerRole from "./role.router";

import routerComment from "./comment.router";

import routerShift from "./shift.router";


export default function routes(app) {
  app.use("/api/bookings", bookingRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/permissions", routerPermission);
  app.use("/api/roles", routerRole);

  app.use("/api/posts", routerPost);
  app.use("/api/comments", routerComment);

  app.use("/api/childrentPicth",routerChildrentPitch)
  app.use("/api/shift", routerShift)

}
