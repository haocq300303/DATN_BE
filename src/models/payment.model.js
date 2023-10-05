import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Payment = new Schema(
    {
        user_bank: { type: Schema.Types.ObjectId, ref: "User" },
        user_receiver: { type: Schema.Types.ObjectId, ref: "User" },
        code: { type: String, require: true },
        payment_method: { type: String, require: true, enum: ["cash", "banking"], default: "cash" },
        price: { type: Number, require: true },
        status: { type: String, require: true, enum: ["done", "error"], default: "done" },
        message: { type: String, require: true, maxLength: 255 },
    },
    { collection: "payment", timestamps: true }
);

const PaymentModel = mongoose.model("payment", Payment);

export default PaymentModel;
