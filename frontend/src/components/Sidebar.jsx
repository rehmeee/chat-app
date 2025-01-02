/* eslint-disable react/prop-types */
function Sidebar({
  connectedRooms,
  selectedRoom,
  randomUsers,
  handleRoomClickForRandomUsers,
  handleRoomClick,
}) {
  return (
    <>
      {connectedRooms.length
        ? connectedRooms.map((room, index) => (
            <li
              key={index}
              className={` cursor-pointer rounded ${
                selectedRoom === room ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
              onClick={() => handleRoomClick(room)}
            > 
              <div className="flex place-items-center mb-5 gap-1 rounded-xl bg-chatBg">
                <img
                  src={room.profilePic}
                  alt=""
                  className="w-10 h-10 rounded-full bg-black"
                />
                <div className="  w-full rounded-xl  px-2">
                  <h2 className=" font-bold">
                    {room.fullName || "Loading..."}
                   
                  </h2>
                </div>
              </div>
            </li>
          ))
        : randomUsers.map((randomUser, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer rounded ${
                selectedRoom === randomUser
                  ? "bg-gray-300"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleRoomClickForRandomUsers(randomUser)}
            >
              <div className="flex place-items-center mb-5 gap-1 rounded-xl bg-chatBg">
                <img
                  src={randomUser.profilePic}
                  alt=""
                  className="w-10 h-10 rounded-full bg-black"
                />
                <div className="  w-full rounded-xl  px-2">
                  <h2 className=" font-bold">
                    {randomUser.fullName || "Loading..."}
                    
                  </h2>
                </div>
              </div>
            </li>
          ))}
    </>
  );
}

export default Sidebar;
