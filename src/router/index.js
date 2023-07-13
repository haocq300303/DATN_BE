import bookingRouter from "./booking.router";

export default function routes(app) {
    app.use('/api/bookings', bookingRouter)
}