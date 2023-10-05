import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Booking = new Schema(
    {
        pitch_id: { type: Schema.Types.ObjectId, ref: "Pitch" },
        user_id: { type: Schema.Types.ObjectId },
        shift_id: { type: String, require: true },
        children_pitch_id: { type: String, require: true },
        payment_id: { type: Schema.Types.ObjectId, ref: "Payment" },
    },
    { collection: "booking", timestamps: true }
);

Booking.virtual("user", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
});

const BookingModel = mongoose.model("booking", Booking);

export default BookingModel;
