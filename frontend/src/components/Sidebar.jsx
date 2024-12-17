/* eslint-disable react/prop-types */
function Sidebar({user, loading, connectedRooms, selectedRoom,randomUsers, handleRoomClickForRandomUsers,handleRoomClick}) {
    return (
        <div className="w-1/4 bg-gray-500 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">
          {user.username || "Loading..."}
        </h2>
        <ul className="space-y-2">
          {loading ? (
            <p>Loading...</p>
          ) : connectedRooms.length > 0 ? (
            connectedRooms.map((room, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer rounded ${
                  selectedRoom === room ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
                onClick={() => handleRoomClick(room)}
              >
                {room.fullName}
              </li>
            ))
          ) : (
            randomUsers.map((randomUser, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer rounded ${
                  selectedRoom === randomUser
                    ? "bg-gray-300"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleRoomClickForRandomUsers(randomUser)}
              >
                {randomUser.fullName}
              </li>
            ))
          )}
        </ul>
      </div>       
    )
}

export default Sidebar
