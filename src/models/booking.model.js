import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Booking = new Schema(
    {
        id_pitch: { type: String, require: true },
        id_user: { type: String, require: true },
        id_shift: { type: String, require: true },
        id_children_pitch: { type: String, require: true },
        id_payment: { type: String, require: true },
        price: { type: Number, require: true },
    },
    { collection: "booking", timestamps: true }
);

const BookingModel = mongoose.model("booking", Booking);

export default BookingModel;
