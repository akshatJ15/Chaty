import cloudinary from '../lib/cloudinaryConfig.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getUsersForSidebar=async (req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json({
            success:true,
            filteredUsers
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

export const getMessages=async(req,res)=>{
    try{
        const {id:userToChatId}=req.params;
        const senderId=req.user._id;

        const messages=await Message.find({
            $or:[
                {senderId:senderId, receiverId:userToChatId},
                {senderId:userToChatId , receiverId:senderId}
            ]
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

export const sendMessage=async (req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:receiverId} =req.params;
        const senderId=req.user._id;

        let imageUrl;
        if(image)
        {
            const uploadRespone=await cloudinary.uploader.upload(image);
            imageUrl=uploadRespone.secure_url;
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();

        res.status(201).json({
            success:true,
            newMessage
        });
        
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}