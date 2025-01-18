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
            className={`cursor-pointer rounded-lg p-3 transition ${
              selectedRoom === room
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleRoomClick(room)}
          >
            <div className="flex items-center gap-3">
              <img
                src={room.profilePic}
                alt=""
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
              <h2 className="text-gray-800 font-medium text-lg">
                {room.fullName || "Loading..."}
              </h2>
            </div>
          </li>
        ))
      : randomUsers.map((randomUser, index) => (
          <li
            key={index}
            className={`cursor-pointer rounded-lg p-3 transition ${
              selectedRoom === randomUser
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleRoomClickForRandomUsers(randomUser)}
          >
            <div className="flex items-center gap-3">
              <img
                src={randomUser.profilePic}
                alt=""
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
              <h2 className="text-gray-800 font-medium text-lg">
                {randomUser.fullName || "Loading..."}
              </h2>
            </div>
          </li>
        ))}
  </>
  
  );
}

export default Sidebar;
