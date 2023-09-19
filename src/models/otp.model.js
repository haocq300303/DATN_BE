import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    phone_number: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Otp", otpSchema);
