import mongoose from "mongoose";
const shiftSchema = new mongoose.Schema({
    id_chirlden_pitch:{
       type: String
    },
    timeslot:{ // ca san 
        type:Array,
        required:true,
    },
    price:{
        type: Number,
        required:true,
    },
    statusPitch:{
        type:Boolean,
        required:true,
    }
})
export default mongoose.model("Shift",shiftSchema);