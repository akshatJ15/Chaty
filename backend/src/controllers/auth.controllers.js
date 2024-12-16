import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import {setCookiesAndGenerateJwt} from '../lib/utils.js';
import cloudinary from '../lib/cloudinaryConfig.js';

export const signup=async (req,res)=>{
    const {email,fullName,password}=req.body;
    try{
        if(!email || !fullName || !password)
        {
            return res.status(400).json({
                success:false,
                message:'All Fileds Are required'
            });
        }
        if(password.length<6)
        {
            return res.status(400).json({
                success:false,
                message:'Password length is too short'
            });
        }
        const userAlreadyExist=await User.findOne({email});
        if(userAlreadyExist)
        {
            return res.status(400).json({
                success:false,
                message:"Email Already Exist try Login Insted"
            });
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);

        
        const user=new User({
            email,
            password:hashedPassword,
            fullName,
        });
        
        setCookiesAndGenerateJwt(res,user._id);
        
        await user.save();

        return res.status(200).json({
            success:true,
            message:"User SignedIn Successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        });
    }
    catch(error){
        return res.status(500).json({ 
            success:false,
            message:error.message
        })
    }
}

export const login=async (req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email || !password)
        {
            return res.status(400).json({ 
                success:false,
                message:"All Fields Are Required"
            });
        }
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({ 
                success:false,
                message:"Email does not exist try SignUp Insted"
            });
        }
        const isPasswordCorrect=await bcryptjs.compare(password,user.password);
        if(!isPasswordCorrect)
        {
            return res.status(400).json({ 
                success:false,
                message:"Password is Incorrect"
            });
        }

        setCookiesAndGenerateJwt(res,user._id)

        return res.status(200).json({ 
            success:true,
            message:"User Logged In Successfully",
            user
        });
    }
    catch(error){
        return res.status(500).json({ 
            success:false,
            message:error.message
        })
    }
}

export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({ 
            success:true,
            message:"User Logged Out Successfully",
            user
        });
    }
    catch(error){
        return res.status(500).json({ 
            success:false,
            message:error.message
        })
    }
}

export const updateProfile=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic)
        {
            return res.status(400).json({
                success:false,
                message:"Profile Pic is Required"
            });
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic);

        const updatesUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        
         res.status(200).json({
            success:true,
            updatesUser
         });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
         });
    }
}

export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        console.log("Error in checkAuth Controller", error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}