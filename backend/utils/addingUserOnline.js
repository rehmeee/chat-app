import { OnlineUsers } from "../models/onlineUser.model.js"

export const  addUserOnline = async (socket) => {
    try {
        const alreadyOnline = await OnlineUsers.findOne({
            userId: socket.user._id
        })
        if(alreadyOnline){
            return true;
        }

        const response = await OnlineUsers.create({
            userId: socket.user._id,
            socketId:  socket.id
        })
        if(response) return true;
        return false;
    } catch (error) {
        return false 
    }
}