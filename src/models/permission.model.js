import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role_id: {
      default: null,
      type: mongoose.ObjectId,
      ref: "Role",
    },
    code: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Permission", permissionSchema);
