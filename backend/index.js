import express, { urlencoded } from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { dbConnection } from "./db/dbConnection.js"
dotenv.config()


const app = express()
const server = http.createServer(app)
app.use(urlencoded())
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN,
        allowedHeaders : true,
        Credential : true
}))
// app.use()
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
})});
server.listen(process.env.PORT, ()=>{
    console.log("server is listening at port", process.env.PORT)
})
})


io.on("connection", (socket)=>{
    socket.on("chat message", (msg)=>{
        io.emit("chat message", msg)
    })
    console.log(" a socket is connected ", socket.id)
})


import userRouter from "./routes/user.routes.js"
import cookieParser from "cookie-parser"

app.use("/user", userRouter)


