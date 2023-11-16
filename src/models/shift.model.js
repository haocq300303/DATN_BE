import mongoose from "mongoose";
const shiftSchema = new mongoose.Schema({
    
    id_chirlden_pitch:{
       type: String,
    },
    number_shift:{
        type: Number,
    },
    time_start:{ 
        type:String,
        required:true,
    },
    time_end:{ 
        type:String,
        required:true,
    },
    price:{
        type: Number,
        required:true,
    },
    statusPitch:{
        type:Boolean
    }
})
export default mongoose.model("Shift",shiftSchema);