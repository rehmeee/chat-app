/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom"


const Login = () => {
    const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const getCookie = (name)=>{
      const cookies = document.cookie.split(";")
      for(let cookie of cookies){
        //console.log(cookie, "cookie in getCookie")
        const[key,value] = cookie.trim().split("=")
        if(key === name){
          return value
        }
      }
      
  }
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter both username and password.");
      return;
    }
    let type = "username"
    if(username.includes("@"))
    {
      type= "email";
    }
    console.log(type, "type of text you entered")
   try {
      async function loginuser() {
        const response = await axios.post(import.meta.env.VITE_LOCAL_HOST_LINK_LOGIN, {
          username, 
          type,
          password
        },{
          headers:{
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        //console.log(response)
        if(response.status === 200){
          sessionStorage.setItem("accessToken", getCookie("accessToken"))
          sessionStorage.setItem("refreshToken", getCookie("refreshToken"))
          //console.log(document.cookie)
          //console.log(getCookie("refreshToken"))
          navigate("/");
        }
      }
      
      loginuser()
   } catch (error) {
    console.log("this is error message",error.message)
    alert(error.message)
   }
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Login to Chat App</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username/email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username/email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
