import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";

const createRoom = async (currentUser, targetUser, roomId) => {
  try {
    const room = await Room.create({
      id: roomId,
      createdBy: currentUser,
      members: [currentUser, targetUser],
    });
    if (!room) {
      console.log("room is not created ");
      return null;
    }
    await User.findByIdAndUpdate(currentUser, {
      rooms: room?._id,
    });
    await User.findByIdAndUpdate(targetUser, {
      rooms: room?._id,
    });
    return room;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
export { createRoom };
