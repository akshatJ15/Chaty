import express from 'express'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js'
import cors from 'cors';

dotenv.config();

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

const PORT=process.env.PORT||5001;

app.listen(PORT,()=>{
    console.log("Server is running on port number",PORT);  
    connectDB(); 
})