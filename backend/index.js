import express, { urlencoded } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db/dbConnection.js";
import { socketAuth } from "./middleware/socket.middleware.js";
    
// routing
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { getRandomUsers } from "./utils/randomUsers.js";
import { createRoom } from "./utils/roomCreation.js";
import { Room } from "./models/room.model.js";
import { User } from "./models/user.model.js";
import { getConnectedUser } from "./utils/getUsersOfConnectedRooms.js";
import { OnlineUsers } from "./models/onlineUser.model.js";
import { addUserOnline, removeUserOnline } from "./utils/addingUserOnline.js";
import { saveMessage } from "./utils/handleMessaging.js";
import socketFileUpload from "socketio-file-upload"
import { uploadToCloudinary } from "./utils/cloudinary.js";
import { updateUserInfo } from "./utils/updateUserInfo.js";
 
dotenv.config();

// exprss middlewares   
const app = express();
const server = http.createServer(app);
app.use(
  urlencoded({
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

app.use(socketFileUpload.router)

// app.use()
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    allowedHeaders: true,
    Credential: true,
  },
  maxHttpBufferSize: 1e8
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

// when connection is established
io.on("connection", (socket) => {

  // listen for the files that comes with the request
  const uploader = new socketFileUpload();
  uploader.dir = "uploads"
  uploader.listen(socket);
  uploader.on("start", async(event)=>{
    
    
  });
  uploader.on("saved", async(event)=>{
    console.log("i am in save ")
    const response = await uploadToCloudinary(event.file.name,socket.user?._id);
    console.log(response)
  });
   

  // add the user to online users
  (async () => {
    const response = await addUserOnline(socket).then();
    if (!response) {
      socket.emit("error", { message: "error while adding user online" });
    }
  })();

  // remove the user from online users when he dissconnects
  socket.on("disconnect", () => {
    (async () => {
      const response = await removeUserOnline(socket).then();
      if (!response) {
        socket.emit("error", { message: "error while removing user online" });
      }
      console.log(" socket is dissconnect", socket.id);
    })();
  });

  // update the user info 

  socket.on("updateInfo", async(data)=>{
  const response = await  updateUserInfo(data,socket.user?._id)
    console.log(response)
  })

  // send the user info back
  socket.emit("userInfo", socket.user);

  // send the random users if user dont have connection yet
  socket.on("want-suggestions", async (arg) => {
    try {
      const randomusers = await getRandomUsers(arg).then();
      // console.log("ranmdom users are a", randomusers);
      socket.emit("suggestions", randomusers);
    } catch (error) {
      socket.emit("error", { message: "error while fetching random users" });
    }
  });

  // create room
  socket.on("create-room", async ({ selectedUser, roomId }, callback) => {
    console.log("in create room ", selectedUser);
    try {
      // check if room already
      const roomExists = await Room.findOne({
        id: roomId,
      });

      // get the target user socket
      const selectedUserSocketId = await OnlineUsers.findOne({
        userId: selectedUser._id,
      });

      const getTargetUserSocket = io.sockets.sockets.get(
        selectedUserSocketId.socketId
      );

      if (!roomExists) {
        const room = await createRoom(
          selectedUser,
          socket.user?._id,
          roomId
        ).then();
        if (getTargetUserSocket) {
          getTargetUserSocket.emit("room-created", {
            room,
            createdBy: socket.user,
          });
          getTargetUserSocket.join(room.roomId);
        }
        socket.join(room.roomId);
        callback({ success: true, roomId });
        return;
      }
      socket.join(roomId);
      if (getTargetUserSocket) {
        getTargetUserSocket.join(roomId);
      }

      callback({ success: true, roomId });
    } catch (error) {
      callback({ success: false });
    }
  });

  // chat message
  socket.on("chat message", async ({ content, roomId, roomDbId, sender }) => {
    // store the message in db
    const response = await saveMessage(content, sender, roomDbId).then();
    if (!response) {
      socket.emit("error", { message: "Message Cannot be stored" });
    } else {
      io.to(roomId).emit("chat message", { content, sender });
    }
  });

  // the the details about the connected users 
  socket.on("get-connected-users", async () => {
    try {
      console.log(
        " i am in geting user for connected users for  ",
        socket.user.username
      );
      //console.log(rooms)
      const users = await getConnectedUser(socket).then();

      //console.log(users);

      socket.emit("connected-users", users);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // join room
  socket.on("request-to-join-room", async ({ roomId, targetUser }) => {
    socket.join(roomId);
    console.log("join room ", roomId, socket.user.username)
    const room = await OnlineUsers.findOne({
      userId: targetUser,
    });
    
    const targetUserSocket = io.sockets.sockets.get(room.socketId);
    // console.log(targetUserSocket, "this is target socket")
    if (targetUserSocket) {
      targetUserSocket.emit("room-joining-notification", {
        roomId,
        senderUser: socket.user,
      });
    }
  });
  
  // join room
  socket.on("join-room", ({ roomId }) => {
    console.log("join room ", roomId, socket.user.username)

    socket.join(roomId);
  });

  // socket dissconnect
  socket.on("disconnect", async () => {
    await OnlineUsers.findOneAndDelete({
      socketId: socket.id,
    });
  });
});


app.use("/user", userRouter);
