import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "./asyncHandler.js";

const getRandomUsers = async (userid) => {
  try {
    // console.log("id in get random users", userid)
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(userid) },
        },
      },
      {
        $sample: {
          size: 5,
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          profilePic: 1,
          description: 1
        },
      },
    ]);
    //console.log(users)
    return users;
  } catch (error) {
    console.log("error while finding ramdon users", error.message);
    return ["noting found "];
  }
};
export { getRandomUsers };
