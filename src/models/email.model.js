import mongoose, { Schema } from "mongoose";

const emailSchema = new Schema(
  {
    email_to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
    html: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Email", emailSchema);
