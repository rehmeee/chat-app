import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// cookie options 
const options = {
    httpOnly: false,
    secure: false
   }
// genrate tokens 
const genrateTokens = async (userid) => {
    const user  = await User.findById(userid);
    try {
            const accessToken = user.genrateAccessToken()
            const refreshToken  = user.genrateRefreshToken();
            console.log("access token is ", accessToken)
            user.refreshToken = refreshToken;

             await user.save({validateBeforeSave:false })
            return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiErrors(200, "error while genrating token ")
    }
}
// register user 
const registerUser = asyncHandler(async (req, res) => {
        const {username, email, fullName, password} = req.body;
        if(!username || !email || !password){
            throw new ApiErrors(200, "please provide email password and username correctly")
        }
       const user =  await User.create({
            username, 
            email, 
            fullName, 
            password
        })
        if (!user) {
            throw new ApiErrors(200, "no user is created")
        }
        return res
        .status(400)
        .json(user)
})

// user login
const loginUser = asyncHandler(async (req, res) => {
    const{type, password} = req.body;
    console.log(req.body)
    if(!password || !type ){
        throw new ApiErrors(200, "please provde the creditionals correctly")
    }
    if(type === "email"){
        const {email} = req.body;
       const user =  await User.findOne({
            email : email
        })
        if(!user){
            throw new ApiErrors(400, "you Dont have account yet!")
        }
       const validUser =  user.checkPassword(password)
       if(!validUser){
        throw new ApiErrors(400, "please provde the creditionals correctly")
       }
       const {accessToken, refreshToken} = genrateTokens(user?._id)
       if(!accessToken || !refreshToken){
        throw new ApiErrors(400, "no access and refresh token found ")
       }
       const options = {
        httponly: true,
        secure: false
       }
       return res
       .status(400)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", refreshToken, options)
       .json(new ApiResponse(
        200, 
        user
       ))


    }
    if(type === "username"){
        const {username} = req.body;
       const user =  await User.findOne({
            username : username
        })
        console.log("this is user", user)
        if(!user){
            throw new ApiErrors(400, "you Dont have account yet!")
        }
       const validUser =  user.checkPassword(password)
       if(!validUser){
        throw new ApiErrors(400, "please provde the creditionals correctly")
       }
       const {accessToken, refreshToken} = await genrateTokens(user?._id)
       if(!accessToken || !refreshToken){
        throw new ApiErrors(400, "no access and refresh token found ")
       }
      
       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", refreshToken, options)
       .json(new ApiResponse(
        200, 
        user
       ))
    }
    return res
    .status(400)
    .json(new ApiResponse(400, {message: "something went wron"}, "something went wrong"))
})

// user Logout
const userLogout = asyncHandler(async (req, res) => {
        const user = await User.findById(req?.user._id);
        if (!user) {
            throw new ApiErrors(400, "no user found")
        }
        user.refreshToken = ""
        await user.save({validateBeforeSave: false})
        return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200,{}))

}) 
export {registerUser, userLogout, loginUser}