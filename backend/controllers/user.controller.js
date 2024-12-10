import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

export {registerUser}