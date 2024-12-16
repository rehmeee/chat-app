import mongoose from "mongoose";
const roomSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String, 
        default : ""
    },
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    members:[
        { type : mongoose.Schema.Types.ObjectId,
            ref: "Users"}
    ]
},{timestamps:true});
export const Room = mongoose.model("Room",roomSchema);