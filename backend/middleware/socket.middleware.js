import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const socketAuth = asyncHandler(async (socket, next) => {
   try {
     const token = socket.handshake.auth.token;
    //  console.log(token, "token in socker auth")
     if(!token){
         return next(new Error("invalid token"))
     }

     const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
    
    const user = await User.findById(data?._id).select("-password -refreshToken")
    if(!user){
          return next(new Error("invalid token"))
 
     }
     socket.user = user;
     next() 
     
   } catch (error) {
    return next(new Error("invalid token"))
   } 

})
export {socketAuth}