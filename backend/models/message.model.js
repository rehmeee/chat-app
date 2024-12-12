import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
        
    },
    reciever:[
        {
            type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
        }
    ],
    roomId:{
        type: String,
        required : true
    },
    content:{
        type: String,
        default : ""
    }
},{timestamps:true});
export const Message = mongoose.model("Message",messageSchema);