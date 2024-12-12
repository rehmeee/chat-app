import express, { urlencoded } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db/dbConnection.js";
import {socketAuth} from "./middleware/socket.middleware.js"
dotenv.config();

// exprss middlewares
const app = express();
const server = http.createServer(app);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({ origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: true
  })
);


const users = {};


// app.use()
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    allowedHeaders: true,
    Credential: true,
  },
});
dbConnection().then(() => {
  app.get("/", (req, res) => {
    res.json({
      name: "Rehman ali",
    });
  });
  server.listen(process.env.PORT, () => {
    console.log("server is listening at port", process.env.PORT);
  });
});

// this is is simple socket just for connection and to inform the connected users i am online 
io.use(socketAuth) // autentication for authurization
io.on("connection", (socket)=>{
  io.emit("notification", `a user is connected ${socket.user.username}`)
  // store for temprarely check if the user is online or not 
   users[socket.user._id] = socket.id;

  // send the user info back 
  socket.emit("userInfo" , socket.user)

  // send the random users if user dont have connection yet 
  socket.on("want-suggestions", async(arg)=>{
    try {
    const randomusers = await getRandomUsers(arg).then()
    console.log("ranmdom users are a", randomusers)
      socket.emit("suggestions", randomusers)
  } catch (error) {
    socket.emit("error", {message: "error while fetching random users"})
  }  
  })
  socket.on("create-room", async (selcetedUser, callback)=>{
    try {
      const currentUser = socket.user._id;
      const targetUser = selcetedUser._id
      const roomId = currentUser < targetUser ? `${currentUser}-${targetUser}`: `${targetUser}-${currentUser}`;
      const roomExists = await Room.findOne({
        id: roomId
      }) 
      console.log(roomExists)
      if(!roomExists){
  
        const room = await createRoom(currentUser, targetUser, roomId).then()
        socket.join(room.id);
        console.log("this is room", room)
      }
      else {
        socket.join(roomId);
        socket.to(users[targetUser]).socketsJoin(roomId);
      }
      io.to(roomId).emit("room-created", {roomId, participents:[currentUser, targetUser], message: "room is created "})
  
      callback({success: true, roomId})
  
    } catch (error) {
      callback({success: false})
    }

      

    
  })
  socket.on('chat message', (message, selectedRoom)=>{
    io.to(selectedRoom).emit("chat message", message, selectedRoom)
  })
})
const chatSocket = io.of("/chat")
chatSocket.use(socketAuth)  
 // handle websockt connection 
chatSocket.on("connection", (socket) => {
  //console.log(socket.user.username, "connected")
 


  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  console.log(" a socket is connected ", socket.id);
});  





// routing 
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { getRandomUsers } from "./utils/randomUsers.js";
import { createRoom } from "./utils/roomCreation.js";
import { Room } from "./models/room.model.js";

app.use("/user", userRouter);
