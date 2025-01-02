import { v2 as cloudinary } from "cloudinary";
import path from "path";

import fs from "fs";
import { User } from "../models/user.model.js"
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadToCloudinary = async (localfileName,id) => {
  const localfilePath = path.resolve("uploads", localfileName);
  console.log("full local file path", localfilePath);
  console.log("i am in cloudinary ", `../uploads/${localfileName}`);
  if (!localfileName) return null;
  try {
    // upload file to cloudinary

    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    if(response){
      const newUser=  await User.findByIdAndUpdate(id,{
        profilePic: response.url
      })
      console.log(newUser, "this is new user")
    }

    fs.unlinkSync(localfilePath);

    return response;
  } catch (error) {
    console.error("error message is ", error);
    fs.unlinkSync(localfilePath);
    return null;
  }
};
export { uploadToCloudinary };
