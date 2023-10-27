import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Booking = new Schema(
    {
        pitch_id: { type: String, require: true },
        user_id: { type: String, require: true },
        shift_id: { type: String, require: true },
        children_pitch_id: { type: String, require: true },
        payment_id: { type: String, require: true },
    },
    { collection: "booking", timestamps: true }
);

const BookingModel = mongoose.model("booking", Booking);

export default BookingModel;
