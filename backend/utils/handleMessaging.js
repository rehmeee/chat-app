import { Message } from "../models/message.model.js"

export const saveMessage = async (content, sender, roomDbId )=>{
    try {
        const response = await Message.create({
            content, 
            roomId: roomDbId, 
            sender: sender._id
        })
        if(!response){
            return false
        }
        return true

    } catch (error) {
        return false
    }
}
