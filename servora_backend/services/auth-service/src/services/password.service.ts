import {User} from "../models/user.model"
import { AppError } from "../utils/AppError"
import otpGenerator from "otp-generator"
import Otp from "../models/otp.model"
import axios from "axios"
import { sendEmailTemplate, sendEmailUpdatePasswordTemplate } from "../templates/sendEmail.templates"
import crypto from "node:crypto"
import bcrypt from "bcrypt"
import { getRedisClient } from "../config/redis.config"
import { sendOtpMessage } from "../producers/otpProducers"
interface iForgotPassword{
    email:string
}

interface iVerifyForgotPasswordOtp{
    email:string,
    otp:string
}

interface iResestPassword{
  password:string,
  confirmPassword:string,
  resetToken:string
}

interface iUpdatePassword{
  oldPassword:string,
  userId:string,
  newPassword:string
}


export const forgotPasswordService=async(data:iForgotPassword)=>{
   const {email}=data

   const existUser=await User.findOne({email})

   if(!existUser){
    throw new AppError("user with email does not exist",400)
   }

   const newOtp=otpGenerator.generate(4,{
    specialChars:false,
    lowerCaseAlphabets:false,
    upperCaseAlphabets:false
   })
    

             //save otp in mongoDB
  //  const newSavedOtp=await Otp.create({
  //   otp:newOtp,
  //   email:email
  //  })


    //save otp in redis
  const redisClient=getRedisClient()
  const newSavedOtp=await redisClient.set(`forgot_password_otp:${email}`,newOtp,{
    EX:300
  })
  const mailData= {
    from:process.env.SENDER_EMAIL,
    email:email,
    subject:"forgot password verfication otp",
    body:sendEmailTemplate(Number(newOtp))
  }
   //asynchronous rabitmq mail call
           sendOtpMessage(mailData)
  
  //synchronous mail call
           //  const mailServiceCall= await axios.post("http://localhost:3002/api/v1/mail/send-mail",mailData)
           //  return  newSavedOtp
}

export const verifyForgotPasswordOtpService=async(data:iVerifyForgotPasswordOtp)=>{

   const {email,otp}=data

   //if forgot password otp in mongoDB atlas 


  //  const otpInDB= await Otp.findOne({email}).sort({createdAt:-1})
  // if(!otpInDB){
  //    throw new AppError("otp  is expired",400)
  //  }
  //  if(otpInDB.otp!= otp){
  //    throw new AppError("otp is wrong",422)
  //  }

  //forgot Password otp on redis
   const redisClient=getRedisClient()
   const otpInRedis=await redisClient.get(`forgot_password_otp:${email}`)
   if(!otpInRedis){
     throw new AppError("otp  is expired",400)
   }
   if(otpInRedis!= otp){
     throw new AppError("otp is wrong",422)
   }

   //generate token

   const token = crypto.randomBytes(32).toString("hex")

   const updatedUser=await User.findOneAndUpdate({email},{
    resetToken:token,
    resetTokenExpiry:Date.now() + 10*60*1000
},{new:true}).select("-password")
   
return updatedUser
}

export const resetPasswordService=async(data:iResestPassword)=>{
  const{resetToken,password,confirmPassword}=data

  if(password!=confirmPassword){
       throw new AppError("password and confirmPassword not equal ",400)
  }
  if(password.length <8){
       throw new AppError("minimum 8 length password required ",400)
  }

  const userinDB=await User.findOne({resetToken:resetToken})

  if(!userinDB){
     throw new AppError("session expired ",400)
  }

  if(userinDB.resetTokenExpiry< String(Date.now())){
    throw new AppError("session expired ",400)
  }

  const hashedPassword=await bcrypt.hash(password,10)

  const updatedUser =await User.findOneAndUpdate({resetToken:resetToken},{
    password:hashedPassword,
    resetToken:"",
    resetTokenExpiry:""
  },{new:true})
  return updatedUser
}

export const updatePasswordService=async(data:iUpdatePassword)=>{


  const{userId,oldPassword,newPassword}=data

  const userInDB=await User.findOne({_id:userId})
  if(!userInDB){
    throw new AppError('user does not exist',400)
  }

  const checkPassword=await bcrypt.compare(oldPassword,userInDB.password)
  if(!checkPassword){
     throw new AppError('incorrect old password',400)
  }


  const newHashedPassword=await bcrypt.hash(newPassword,10)
  const updatedUser= await User.findOneAndUpdate({_id:userId},{
    password:newHashedPassword
  },{new:true})


  const mailData={
   from :process.env.SENDER_EMAIL,
   email:userInDB.email,
   subject:"password update successfully",
   body:sendEmailUpdatePasswordTemplate()
  }

   //asynchronous rabitmq mail call
           sendOtpMessage(mailData)
  
  //synchronous mail call
          // const mailAfterPasswordUpdate=await axios.post(`http://localhost:3002/api/v1/mail/send-mail`,mailData)
  return updatedUser
}