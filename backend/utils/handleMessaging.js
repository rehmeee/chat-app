import { Message } from "../models/message.model.js"

export const saveMessage = async (roomId, content, sender )=>{
    try {
        const response = await Message.create({
            content, 
            roomId, 
            sender: sender._id
        })
        if(!response){
            return false
        }
        return false

    } catch (error) {
        return false
    }
}
