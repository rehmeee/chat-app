import express, { response, urlencoded } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db/dbConnection.js";
import { socketAuth } from "./middleware/socket.middleware.js";
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
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: true,
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
io.use(socketAuth); // autentication for authurization

io.on("connection",  (socket) => {
  
  // add the user to online users
 ( async () => {
   const response = await addUserOnline(socket).then()
   if(!response){
     socket.emit("error", {message: "error while adding user online"})
   }
   console.log("response", response)
    
  })();

  // send the user info back
  socket.emit("userInfo", socket.user);

  // send the random users if user dont have connection yet
  socket.on("want-suggestions", async (arg) => {
    try {
      const randomusers = await getRandomUsers(arg).then();
      console.log("ranmdom users are a", randomusers);
      socket.emit("suggestions", randomusers);
    } catch (error) {
      socket.emit("error", { message: "error while fetching random users" });
    }
  });

  // create room 
  socket.on("create-room", async (selcetedUser, callback) => {
    try {
      const currentUser = socket.user._id;
      const targetUser = selcetedUser._id;
      const roomId =
        currentUser < targetUser
          ? `${currentUser}-${targetUser}`
          : `${targetUser}-${currentUser}`;
      const roomExists = await Room.findOne({
        id: roomId,
      });
      console.log(roomExists);
      if (!roomExists) {
        const room = await createRoom(currentUser, targetUser, roomId).then();
        socket.join(room.id);
        console.log("this is room", room);
      } else {
        socket.join(roomId);
        socket.to(users[targetUser]).socketsJoin(roomId);
      }
      io.to(roomId).emit("room-created", {
        roomId,
        participents: [currentUser, targetUser],
        message: "room is created ",
      });

      callback({ success: true, roomId });
    } catch (error) {
      callback({ success: false });
    }
  });

  // chat message
  socket.on("chat message", ({ content, room,sender }) => {
    // console.log(content, room)
    socket.join(room);
    io.to(room).emit("chat message", {content, sender});
  });

  socket.on("get-room-user", async (rooms) => {
    try {
      //console.log(" i am in geting user ");
      //console.log(rooms)
      const users = await getConnectedUser(rooms, socket).then();

      //console.log(users);

      socket.emit("connected-users", users);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // join room
  socket.on("request-to-join-room", ({ roomId, targetUser }) => {
    console.log("in join room");
    console.log(users);
    console.log(roomId, targetUser);
    socket.join(roomId);
    io.to(users[targetUser]).emit("join-room", {
      message: "join this room ",
      roomId: roomId,
      sender: socket.user,
    });
  });
  
  // join room
  socket.on("join-room", ({ roomId }, callback) => {
    socket.join(roomId);
    callback({ success: true });
  });

  // socket dissconnect 
  socket.on("disconnect", async()=>{
    await OnlineUsers.findOneAndDelete({
      socketId: socket.id
    })
   
  })
});

// routing
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { getRandomUsers } from "./utils/randomUsers.js";
import { createRoom } from "./utils/roomCreation.js";
import { Room } from "./models/room.model.js";
import { User } from "./models/user.model.js";
import { getConnectedUser } from "./utils/getUsersOfConnectedRooms.js";
import { OnlineUsers } from "./models/onlineUser.model.js";
import { addUserOnline } from "./utils/addingUserOnline.js";

app.use("/user", userRouter);
