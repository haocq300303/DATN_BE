import mongoose from "mongoose";

const childrenPitchSchema = new mongoose.Schema(
    {
        idParentPitch: {
            type: String,
            required: true,
        },
        code_chirldren_pitch: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("ChildrenPitch", childrenPitchSchema);
