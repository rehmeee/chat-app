import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";

const getConnectedUser = async (rooms, socket) => {
  try {
    //  console.log(rooms)
    const users = await Promise.all(rooms.map((room) => getUser(room, socket)));
    //console.log(users)
    return users;
  } catch (error) {
    return [];
  }
};

async function getUser(id, socket) {
  try {
    const room = await Room.findById(id);
    const user = room.members.filter(
      (id) => id.toString() != socket.user._id.toString()
    );
    const a = await User.findById(user[0]).select("-password -refreshToken");
    const userObject = a.toObject();
    userObject.roomId = room.id;
    //console.log("this is user",a )
    return userObject;
  } catch (error) {
    return {};
  }
}
export { getConnectedUser };
