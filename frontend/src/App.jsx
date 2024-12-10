import { useState,useEffect } from 'react'
import {io} from "socket.io-client"

import './App.css'

function App() {
  const socket = io("http://localhost:5000")
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  useEffect(()=>{
      socket.emit("chat message", "hello mani boss");
      socket.on("chat message", (msg)=>{
        console.log(msg)
      });
      socket.on("dissconnect", ()=>{
        console.log("a user is dissconnect")
      })
  },[])
  return (
    <>
    
    </>
  )
}

export default App
