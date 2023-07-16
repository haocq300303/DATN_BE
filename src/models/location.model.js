import mongoose, { Schema } from "mongoose";

const LocationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        pitchs: {
            type: mongoose.ObjectId,
            ref: "Pitch",
        }
    }
);

export default mongoose.model("Location", LocationSchema);
