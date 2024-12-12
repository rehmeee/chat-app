import { Room } from "../models/room.model.js"

const createRoom = async (currentUser, targetUser, roomId) => {
    try {
            const room = await Room.create({
                id: roomId,
                createdBy: currentUser,
                members: [currentUser, targetUser]

            })
            if(!room){
                console.log("room is not created ")
                return null
            }
            return room
    } catch (error) {
        console.log(error.message)
        return null
    }
    
}
export {createRoom}