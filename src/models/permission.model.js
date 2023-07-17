import mongoose, { Schema } from "mongoose";
import Role from "./role.model";

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    code: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

permissionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const permission = this;
    const role = await Role.findById(permission.role_id);
    role.permissions.push(permission._id);
    await role.save();
  }
  next();
});

export default mongoose.model("Permission", permissionSchema);
