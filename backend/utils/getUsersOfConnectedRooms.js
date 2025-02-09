import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";

const getConnectedUser = async ( socket) => {
  try {
    //  console.log(rooms)
    const user = await User.findById(socket.user?._id)
    const connectedusers = await Promise.all(user.rooms.map((room) => getUser(room, socket)));
    //console.log(users)

    return connectedusers;
    
  } catch (error) {
    return [];
  }
};

async function getUser(id, socket) {
  try {  
    //console.log( " i am in get user", id)
    const room = await Room.findById(id).populate({
      path: "chat", 
      populate:{ 
        path:"sender",
        select: "username fullName"
      }
    });
    //console.log("this is the room ", room)
    const user = room.members.filter(
      (id) => id.toString() != socket.user._id.toString()
    );
    const a = await User.findById(user[0]).select("-password -refreshToken");
    const userObject = a.toObject();
    userObject.roomId = room.id;
    userObject.roomDbId = room._id;
     userObject.chat = room.chat;
    //console.log("this is user",a )
    return userObject;
  } catch (error) {
    return {};
  }
}
export { getConnectedUser };
