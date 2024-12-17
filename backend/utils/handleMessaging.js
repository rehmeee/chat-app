import { Message } from "../models/message.model.js";
import { Room } from "../models/room.model.js";

export const saveMessage = async (content, sender, roomDbId) => {
  try {
    const response = await Message.create({
      content,
      roomId: roomDbId,
      sender: sender._id,
    });
    if (response) {
      await Room.findByIdAndUpdate(roomDbId, {
        $push: { chat: response?._id },
      });
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};
