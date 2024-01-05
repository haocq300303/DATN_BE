import bookingRouter from "./booking/booking.router";
import routerChildrentPitch from "./childrentPitch.router";
import paymentRouter from "./payment.router";
import routerPermission from "./permission.router";
import routerBanner from "./banner.router";
import routerService from "./service.router";
import routerPost from "./post.router";
import routerRole from "./role.router";
import routerUser from "./user.router";
import routerOtp from "./otp.router";
import routerComment from "./comment.router";
import routerLocation from "./location.router";
import routerPitch from "./pitch.router";
import routerShift from "./shift.router";
import routerFeedback from "./feedback.router";
import routerPayment from "./vnpay.router";
import routerEmail from "./email.router";
import statisticalRouter from "./statistical/statistical.router";

export default function routes(app) {
    app.use("/api/bookings", bookingRouter);
    app.use("/api/payments", paymentRouter);
    app.use("/api/permissions", routerPermission);
    app.use("/api/roles", routerRole);
    app.use("/api", routerUser);
    app.use("/api/otps", routerOtp);
    app.use("/api/posts", routerPost);
    app.use("/api/comments", routerComment);
    app.use("/api/banners", routerBanner);
    app.use("/api/services", routerService);
    app.use("/api/childrentPicth", routerChildrentPitch);
    app.use("/api/shift", routerShift);
    app.use("/api/location", routerLocation);
    app.use("/api/pitch", routerPitch);
    app.use("/api/feedback", routerFeedback);
    app.use("/api/vnpay", routerPayment);
    app.use("/api/email", routerEmail);
    app.use("/api/statistical", statisticalRouter);
}
