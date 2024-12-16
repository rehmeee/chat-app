import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";

const createRoom = async (selectedUser,currentUserId,  roomId) => {
  try {
    
    const room = await Room.create({
      id: roomId,
      createdBy:  currentUserId,
      members: [currentUserId, selectedUser?._id],
    });
    if (!room) {
      return null;
    } 
    await User.findByIdAndUpdate(currentUserId, {
      $push:{rooms: room?._id}
    });
    await User.findByIdAndUpdate(selectedUser?._id, {
      $push:{ rooms: room?._id}
     
    });
    return room;  
  } catch (error) {
    console.log(error.message);
    return null;
  }   
};
export { createRoom }; 
