import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { dbConnection } from "./db/dbConnection.js"
dotenv.config()


const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: process.env.ORIGIN,
        allowedHeaders : true,
        Credential : true 
    }
})
dbConnection().then(()=>{
    app.get("/", (req, res)=>{
    res.json({
        name: "Rehman ali"
    })
})
})

io.on("connection", (socket)=>{
    socket.on("chat message", (msg)=>{
        io.emit("chat message", msg)
    })
    console.log(" a socket is connected ", socket.id)
})

server.listen(process.env.PORT, ()=>{
    console.log("server is listening at port", process.env.PORT)
})

