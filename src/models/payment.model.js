import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Payment = new Schema(
    {
        user_bank: { type: Schema.Types.ObjectId, ref: "User" },
        user_receiver: { type: Schema.Types.ObjectId, ref: "User" },
        payment_method: {
            type: String,
            require: true,
            enum: ["cash", "banking"],
            default: "cash",
        },
        price_received: { type: Number, require: true },
        code: { type: String, require: true },
        total_received: { type: Number, require: true },
        status: {
            type: String,
            require: true,
            enum: ["pending", "success", "error"],
            default: "pending",
        },
        message: { type: String, require: true, maxLength: 255 },
    },
    { collection: "payment", timestamps: true }
);

const PaymentModel = mongoose.model("payment", Payment);

export default PaymentModel;
