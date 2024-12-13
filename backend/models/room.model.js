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
    ],
    messages:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Messages"
        },
    ]
},{timestamps:true});
export const Room = mongoose.model("Room",roomSchema);