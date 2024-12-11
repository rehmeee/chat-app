import mongoose from "mongoose"

const dbConnection = async()=>{
    try {
        
        console.log("connecting!")
       const response = await mongoose.connect(`${process.env.DATABASE_URI}`);
       console.log(response.connection.host)
    } catch (error) {
        console.log("reason", error.message)
        
    }
} 

export {dbConnection}