import { AppError } from "../utils/AppError"
import { User } from "../models/user.model"
import Otp from "../models/otp.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getRedisClient } from "../config/redis.config"
import {sendProfileMessage} from "../producers/profileProducer"
interface IUserData{
     fullName:string,
     email:string,
     password:string,
     otp:string
}

interface iLogin{
    email:string,
    password:string
}

interface iupdateRole{
   UserId:string,
   role:string
}
export const signUpService=async(data:IUserData)=>{
   
     const {fullName,email,password,otp}=data
     const isRegistered=await User.findOne({email})

     if(isRegistered){
        throw new AppError("user already registered",404)
     }
         //if otp store in mongodb
   //   const latestOtp=await Otp.findOne({email}).sort({createdAt:-1})

   
        //redis client

       const redisClient = getRedisClient();
       const latestOtp= await redisClient.get(`redis_client ${email}`) 

     if(!latestOtp){
         throw new AppError("otp expired",404)
     }

     if(latestOtp!=otp){
        throw new AppError('otp is incorrect',404)

     }

     const hashedPassword=await bcrypt.hash(password,10)

     const newUser= await User.create({
        fullName,
        password:hashedPassword,
        email,
        role:"User"
     })

   //   const profileImage=await `https://api.dicebear.com/10.x/lorelei/svg?seed=${fullName}`
   const profileImage=null
  //send message to userservice
     
    sendProfileMessage({authUserId:newUser._id,email:email,fullName:fullName,profileImage:profileImage})

console.log("After create", newUser);
    
     const payload= {
        fullName,
        email,
        role:"User",
        userId:newUser._id
     }
     const accessSecreateKey = process.env.ACCESS_TOKEN_SECREAT_KEY

     if(!accessSecreateKey){
        throw new AppError("canot find secreat key",404)
     }
     const accessToken =await jwt.sign(payload,accessSecreateKey,{
        expiresIn:"15min"
     })
     
const refreshTokenPayload= {
        
        userId:newUser._id
     }
     const refreshSecreateKey = process.env.REFRESH_TOKEN_SECREAT_KEY

     if(!refreshSecreateKey){
        throw new AppError("canot find secreat key",404)
     }
     const refreshToken =await jwt.sign(refreshTokenPayload,refreshSecreateKey,{
        expiresIn:"7d"
     })


     //save refresh token in redis


     await redisClient.set(`session:${newUser._id}`,refreshToken,{
      EX:604800
     })
     const userObj:any=newUser.toObject()
     userObj.accessToken=accessToken
     userObj.password=undefined
     return {userObj,refreshToken}

}


export const loginService=async(data:iLogin)=>{
  const {email,password}=data

  const existUser=await User.findOne({email})

  if(!existUser){
    throw new AppError("user does not exist with this email",400)
  }
const hashedPassword=existUser.password
  const ispasswordCorrect=await bcrypt.compare(password,hashedPassword)

  if(!ispasswordCorrect){
    throw new AppError("wrong password",400)

  }
  
   const payload= {
          fullName:existUser.fullName,
          email:existUser.email,
          role:existUser.role,
          userId:existUser._id
       }
       const accessSecreateKey = process.env.ACCESS_TOKEN_SECREAT_KEY

     if(!accessSecreateKey){
        throw new AppError("canot find secreat key",404)
     }
     const accessToken =await jwt.sign(payload,accessSecreateKey,{
        expiresIn:"15min"
     })
     const refreshTokenPayload= {
          userId:existUser._id
       }

     const refreshSecreateKey = process.env.REFRESH_TOKEN_SECREAT_KEY

     if(!refreshSecreateKey){
        throw new AppError("canot find secreat key",404)
     }
     const refreshToken =await jwt.sign(refreshTokenPayload,refreshSecreateKey,{
        expiresIn:"7d"
     })

     //STORE REFRESH TOKEN IN REDIS
     
     const redisClient=getRedisClient()
     await redisClient.set(`session:${existUser._id}`,refreshToken,{
      EX:604800
     })

     const userObj:any=existUser.toObject()
     userObj.accessToken=accessToken
   userObj.password=undefined
     return {userObj,refreshToken}
}

export const updateUserService= async(data:iupdateRole)=>{
   const {UserId,role}=data;
     const profileDetail=await User.findOne({_id:UserId})
               if(!profileDetail){
                  throw new AppError("user not found ",404)
            }
    
        const udpadatedUser=await User.findOneAndUpdate({_id:UserId},{
            role:role
        },{returnDocument:"after"})
       return udpadatedUser
}
