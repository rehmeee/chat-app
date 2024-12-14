import { OnlineUsers } from "../models/onlineUser.model.js";

export const addUserOnline = async (socket) => {
  try {
    const alreadyOnline = await OnlineUsers.findOne({
      userId: socket.user._id,
    });
    if (alreadyOnline) {
      alreadyOnline.socketId = socket.id;
      console.log("updating the socket id ")
      await alreadyOnline.save({validateBeforeSave: false})
      return true; 
    }

    const response = await OnlineUsers.create({
      userId: socket.user._id,
      socketId: socket.id,
    });
    if (response) return true;
    return false;
  } catch (error) {
    return false;
  }
};

// to remove the user status from online on disconnection

export const removeUserOnline = async (socket) => {
  try {
    const response = await OnlineUsers.findOneAndDelete({
      userId: socket.user._id,
    });
    if (response) return true;
    return false;
  } catch (error) {
    return false;
  }
};
