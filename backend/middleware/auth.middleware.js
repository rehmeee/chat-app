import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyUser = asyncHandler(async (req, res, next) => {
 try {
     const accessToken =
       req.cookies.accessToken ||
       req.header("Authorization").replace("Bearer ", "");
     if (!accessToken) {
       throw new ApiErrors(400, "no access token was found ");
     }
     const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
     if (!data) {
       throw new ApiErrors(400, "invalid access token");
     }
     const user = await User.findById(data?._id).select("-password")
     if (!user) {
       throw new ApiErrors(400, "no user found ");
     }
     req.user = user;
     next()
 } catch (error) {
    throw new ApiErrors(400, "error while verifyin user ")
 }
});

export {verifyUser}