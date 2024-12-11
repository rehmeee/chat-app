import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const socket = io("http://localhost:5000", {
    reconnection: true,
    auth: {
      token: `${accessToken}`,
    },
  });

  socket.on("connect", ()=>{
    console.log("a user is connected", socket.id)
  })

  socket.on("connect_error",(error)=>{

    console.error("conection error", error.message)
    alert(error.message)
    setErrorMessage(error.message)
    socket.disconnect()
  })
  socket.on("chat message", (msg)=>{
    setMessages([...messages, msg])
  })
  const handleSubmit = (e)=>{
    e.preventDefault()
    socket.emit("chat message", message);
  }

  return <>
   <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Type something..."
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          style={{ padding: "10px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Enter
      </button>
    </div>
  </>;
}

export default App;
