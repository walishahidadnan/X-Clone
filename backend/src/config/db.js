import { ENV } from "./env.js";
import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(ENV.MONGO_URI)
        console.log("Connected to DB successfully ✅");
    }
    catch(error){
        console.error("Error connecting MongoDB", error.message);
        process.exit(1)
    }

        
}