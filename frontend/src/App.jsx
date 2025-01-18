import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";
import Sidebar from "./components/Sidebar";
import socketFileUpload from "socketio-file-upload";
import UserBar from "./components/UserBar";

function App() {
  const [message, setMessage] = useState("");
  const [randomUsers, setRandomUsers] = useState([]);
  const [connectedRooms, setConnectedRooms] = useState([]);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // For selected room/user
  const [loading, setLoading] = useState(true);
  const accessToken = sessionStorage.getItem("accessToken");

  // refrences
  const socket = useRef(null);
  const uploaderRef = useRef(null);
  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      reconnection: true,
      auth: {
        token: `${accessToken}`,
      },
    });

    const uploader = new socketFileUpload(socket.current);
    uploaderRef.current = uploader;
    socket.current.on("error", (data) => {
      console.log(data.message);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Connection error", error.message);
      socket.current.disconnect();
    });

    socket.current.on("room-joining-notification", ({ roomId, senderUser }) => {
      socket.current.emit("join-room", { roomId });
      console.log("request sender for joing room", senderUser);
    });
    socket.current.on("userInfo", (adminUser) => {
      console.log("User adminUser:", adminUser);
      setUser(adminUser);

      // Show random suggestions if no rooms
      if (adminUser.rooms.length === 0) {
        socket.current.emit("want-suggestions", adminUser._id);
        socket.current.on("suggestions", (data) => {
          console.log("Random Users:", data);
          setRandomUsers(data);
          setLoading(false);
        });
      }
      if (adminUser.rooms.length > 0) {
        console.log("i am in ");

        socket.current.emit("get-connected-users");
      } else {
        setLoading(false);
      }
    });

    socket.current.on("chat message", (payload) => {
      console.log(payload);
      setMessages((prev) => [...prev, payload]);
    });

    socket.current.on("room-created", () => {
      socket.current.emit("get-connected-users");
    });

    socket.current.on("connected-users", (users) => {
      console.log(users);
      setConnectedRooms(users);
      setLoading(false);
    });

    return () => {
      socket.current.disconnect(); // Cleanup on unmount
    };
  }, [accessToken]);

  const handleRoomClick = (room) => {
    console.log(room, "this is room ");
    setSelectedRoom(room);
    // room.chat.map(chat=>())
      setMessages(room.chat);
      // socket.current.emit("request-to-join-room", {
        //   roomId: room.roomId,
        //   targetUser: room._id,
        // });
        socket.current.emit("join-room",room.roomId )
  };

  // handle when user click on the random user from the suggestions
  const handleRoomClickForRandomUsers = (randomUser) => {
    const roomId = nanoid(
      10,
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    );
    console.log("this is room id from nano id ", roomId);
    socket.current.emit(
      "create-room",
      { selectedUser: randomUser, roomId },
      (response) => {
        if (response.success) {
          socket.current.emit("get-connected-users");
        } else {
          console.log("error while creating the room ");
        }
      }
    );
  };

  // handle the message sending
  const handleSendMessage = () => {
    if (selectedRoom) {
      console.log(selectedRoom);
      socket.current.emit("chat message", {
        content: message,
        roomId: selectedRoom.roomId,
        roomDbId: selectedRoom.roomDbId,
        sender: user,
      });
    }
    setMessage("");
  };

  const handleEditUserInfo = (formData) => {
    uploaderRef.current.submitFiles([formData.profilePic]);
    socket.current.emit("updateInfo", {
      username: formData.username,
      fullName: formData.fullName,
      description: formData.description
    });
  };
  return (
    <div className="flex h-screen font-sans bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
  {/* Sidebar */}
  <div className="relative w-1/4 p-4 bg-white/80 backdrop-blur-md shadow-lg">
    <div className="mb-8">
      <UserBar user={user} onEditInfo={handleEditUserInfo} />
    </div>
    <p className="text-xl font-semibold text-gray-800 mb-4">
      {connectedRooms.length > 0 ? "Friends:" : "Suggestions:"}
    </p>
    <ul className="space-y-3">
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <Sidebar
          connectedRooms={connectedRooms}
          selectedRoom={selectedRoom}
          randomUsers={randomUsers}
          handleRoomClickForRandomUsers={handleRoomClickForRandomUsers}
          handleRoomClick={handleRoomClick}
        />
      )}
    </ul>
  </div>

  {/* Chat Area */}
  <div className="flex flex-col flex-1 p-6 bg-gray-50">
    {selectedRoom ? (
      <>
        {/* Chat Header */}
        <div className="flex items-center mb-4 p-4 bg-white rounded-lg shadow">
          <img
            src={selectedRoom.profilePic}
            alt="Room Profile"
            className="h-12 w-12 rounded-full border-2 border-indigo-400"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedRoom.fullName}
            </h3>
            <p className="text-sm text-gray-600">{selectedRoom.description}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 max-w-lg ${
                user.username === msg.sender.username
                  ? "ml-auto text-right"
                  : "mr-auto text-left"
              }`}
            >
              <p
                className={`inline-block px-4 py-2 rounded-lg shadow ${
                  user.username === msg.sender.username
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.username !== msg.sender.username && (
                  <span className="block font-semibold text-sm text-indigo-600">
                    {msg.sender.fullName.split(" ")[0]}
                  </span>
                )}
                {msg.content}
              </p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </>
    ) : (
      <p className="text-lg text-gray-700 text-center">
        Select a room or user to start chatting.
      </p>
    )}
  </div>
</div>

  );
}

export default App;
