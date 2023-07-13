import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Payment = new Schema(
    {
        id_user: { type: String, require: true },
        price: { type: Number, require: true },
        status: { type: Boolean, require: true },
        message: { type: String, require: true, maxLength: 255 },
    },
    { collection: "payment", timestamps: true }
);

const PaymentModel = mongoose.model("payment", Payment);

export default PaymentModel;
