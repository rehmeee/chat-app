import mongoose from "mongoose"
import { ApiErrors } from "../utils/apiErrors.js";

const dbConnection = async()=>{
    try {
        console.log("connecting!")
       const response = await mongoose.connect(`${process.env.DATABASE_URI}`);
       console.log(response.connection.host)
    } catch (error) {
        console.log("reason", error.message)
        throw new ApiErrors(400, "error while connecting to database")
    }
}

export {dbConnection}