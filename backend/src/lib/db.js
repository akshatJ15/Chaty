import mongoose from "mongoose";

export const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db Connected Successfully");
    }
    catch(error){
        console.error(error);
    }
}