import mongoose from "mongoose";
const onlineUserSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    socketId: {
        type: String, 
        required: true ,
        
    }

},{timestamps:true});
export const OnlineUsers = mongoose.model("OnlineUsers",onlineUserSchema);