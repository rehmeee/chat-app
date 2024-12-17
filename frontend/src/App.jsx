import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";
import Sidebar from "./components/Sidebar";

function App() {
  const [message, setMessage] = useState("");
  const [randomUsers, setRandomUsers] = useState([]);
  const [connectedRooms, setConnectedRooms] = useState([]);
  const [user, setUser] = useState({});
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

    socket.current.on("room-created", ({ room, createdBy }) => {
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
    console.log(room);
    // room.chat.map(chat=>())
    setMessages(room.chat);
    socket.current.emit("request-to-join-room", {
      roomId: room.roomId,
      targetUser: room._id,
    });
    setSelectedRoom(room);
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
      {/* {for later use} */}
      {/* <Sidebar
        user={user}
        loading={loading}
        connectedRooms={connectedRooms}
        selectedRoom={selectedRoom}
        randomUsers={randomUsers}
        handleRoomClickForRandomUsers={handleRoomClickForRandomUsers}
        handleRoomClick={handleRoomClick}
      /> */}

      {/* Chat Area */}
      <div className="flex flex-col flex-1 p-4 bg-chatBg">
        {selectedRoom ? (
          <>
            <div className=" flex flex-row my-2 p-2 rounded-xl place-items-center bg-chatScreenBg ">
              <img
                src={""}
                alt=""
                className="h-10 rounded-full w-10 bg-white"
              />
              <h3 className="text-xl text-userNameTextColor font-bold ml-2 ">
                {selectedRoom.fullName}
              </h3>
            </div>

            <div
              className="flex-1 overflow-y-auto bg-chatScreenBg p-4 border border-black  rounded-xl mb-4 butterfly overflow-x-hidden  
            "
            >
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className={`mb-2 text-textColor overflow-hidden${
                    user.username === msg.sender.username
                      ? " text-right"
                      : " text-left"
                  }`}
                >
                  {user.username === msg.sender.username ? (
                    <p className="inline-block p-1 rounded-s-xl rounded-t-xl bg-mesgBg px-3">
                      {" "}
                      <span className="">{msg.content}</span>
                    </p>
                  ) : (
                    <p className="inline-block p-1 rounded-e-xl rounded-b-xl bg-mesgBg pr-3 pl-0 overflow-hidden">
                      {" "}
                      <span className="bg-namebg p-2">
                        {msg.sender.fullName.split(" ").shift(0)}
                      </span>
                      <span className="bg-spanbg ml-2">{msg.content}</span>
                    </p>
                  )}
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
