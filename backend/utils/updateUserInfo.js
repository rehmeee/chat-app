import { User } from "../models/user.model.js"

export const updateUserInfo = async (data,userId) => {
    try {
        const respones = await User.findOneAndUpdate(userId,{
            username: data.username,
            fullName: data.fullName,
            description: data.description
        })
        if(respones) return true;
    } catch (error) {
        return false;
    }
}