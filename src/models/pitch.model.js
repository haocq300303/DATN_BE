import mongoose, { Schema } from "mongoose";

const PitchSchema = new Schema(
    {
        address: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        admin_pitch_id: {
            type: String,
            ref: "User",
        },
        numberPitch: {
            type: Number,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        shift_id: {
            type: String,
            ref: "Shift",
            required: true,
        },
        location_id: {
            type: String,
            ref: "Location",
            required: true,
        },
        deposit_price: {
            type: Number,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        }
    }
);

export default mongoose.model("Pitch", PitchSchema);
