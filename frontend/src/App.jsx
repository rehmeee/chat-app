import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [randomUsers, setRandomUsers] = useState([]);
  const [connectedRooms, setConnectedRooms] = useState([]);
  const [user, setUser] = useState({});
  const [errormessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // For selected room/user
  const [loading, setLoading] = useState(true);
  const accessToken = sessionStorage.getItem("accessToken");
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      reconnection: true,
      auth: {
        token: `${accessToken}`,
      },
    });

    // Socket listeners
    socket.current.on("connect", () => {
      console.log("A user is connected", socket.current.id);
    });

    socket.current.on("error", (data) => {
      console.log(data.message);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Connection error", error.message);
      setErrorMessage(error.message);
      socket.current.disconnect();
    });

    socket.current.on("userInfo", (info) => {
      console.log("User info:", info);
      setUser(info);

      // Show random suggestions if no rooms
      if (info.rooms.length === 0) {
        socket.current.emit("want-suggestions", info._id);
        socket.current.on("suggestions", (data) => {
          console.log("Random Users:", data);
          setRandomUsers(data);
          setLoading(false);
        });
      }
      if (info.rooms.length > 0) {
        console.log("i am in ");

        socket.current.emit("get-room-user", info.rooms);

        socket.current.on("connected-users", (users) => {
          console.log(users);
          setConnectedRooms(users);
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    socket.current.on("chat message", (content) => {
      console.log(content);
    });

    socket.current.on("join-room", (data) => {
      console.log(data);
      socket.current.emit("join-room", { roomId: data.roomId }, (response) => {
        if (response.success) {
          console.log("joind the room ");
        }
      });
    });

    return () => {
      socket.current.disconnect(); // Cleanup on unmount
    };
  }, [accessToken]);

  const handleRoomClick = (room) => {
    socket.current.emit("request-to-join-room", {
      roomId: room.roomId,
      targetUser: room._id,
    });
    setSelectedRoom(room);
  };

  // handle when user click on the random user from the suggestions
  const handleRoomClickForRandomUsers = (user) => {
    console.log(user);
    socket.current.emit("create-room", user, (response) => {
      if (response.success) {
        console.log("room created ");
      } else {
        console.log("error while creating the room ");
      }
    });
    socket.current.on("room-created", (data) => {
      console.log("ths is the room id that is created ", data.roomId);
      setSelectedRoom(data);
    });
  };

  // handle the message sending
  const handleSendMessage = () => {
    if (selectedRoom) {
      socket.current.emit("chat message", {
        content: message,
        room: selectedRoom.roomId,
      });
    }
    setMessage("");
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-500 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">
          {user.username || "Loading..."}
        </h2>
        <ul className="space-y-2">
          {loading ? (
            <p>Loading...</p>
          ) : connectedRooms ? (
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

      {/* Chat Area */}
      <div className="flex flex-col flex-1 p-4 bg-green-100">
        {selectedRoom ? (
          <>
            <h3 className="text-xl text-black font-bold mb-4">
              Chat with {selectedRoom.fullName}
            </h3>
            <div className="flex-1 overflow-y-auto bg-orange-200 p-4 border rounded mb-4">
              {messages.map((msg, index) => (
                <p key={index} className="mb-2">
                  {msg}
                </p>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Select a room or user to start chatting.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
