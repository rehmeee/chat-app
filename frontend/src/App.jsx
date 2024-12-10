import { useState,useEffect } from 'react'
import {io} from "socket.io-client"
import axios from "axios"

import {Routes,Route} from "react-router-dom"
import Login from './components/Login';

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
    <Routes>
      <Route path='/login' element={<Login />}/>
    </Routes>
  )
}

export default App
