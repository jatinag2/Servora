import { User } from "../models/user.model"
import { AppError } from "../utils/AppError";
import otpGenerator from "otp-generator"
import Otp from "../models/otp.model"
import { sendEmailTemplate } from "../templates/sendEmail.templates";
import axios from "axios";
import {getRedisClient} from "../config/redis.config"
import { sendOtpMessage } from "../producers/otpProducers";

interface IUserData{
     fullName:string,
     email:string,
     password:string
}
export const sendOtpService=async(data:IUserData)=>{
  try {
     const {email,fullName,password}=data;
     const newUser= await User.findOne({email});
     if(newUser){
        throw new AppError('user with this email exist',400)
     }

     const newOtp=  otpGenerator.generate(4,{
       upperCaseAlphabets:false,
       lowerCaseAlphabets:false,
       specialChars:false,
     })

     // saving otp in mongoDB
  
      // const newSavedOtp=await Otp.create({
      //       email:email,
      //       otp:newOtp
      // })
      // console.log(newSavedOtp)


      //saving otp in redis

      console.log('Before getRedisClient');

const client = getRedisClient();
console.log('Redis client obtained');

const key = `redis_client ${email}`;
console.log('Saving key:', key);

const redisSavedOtp = await client.set(key, newOtp, {
  EX: 300
});

console.log('Redis save result:', redisSavedOtp);
      const mailData={
        email:email,
        subject:`confirming account Verification`,
        body:sendEmailTemplate(Number(newOtp)),
        from:process.env.SENDER_EMAIL
      }

 
     //asynchronous rabitmq mail call
     sendOtpMessage(mailData)

     //synchronous mail call
      // const mailServiceCall=await axios.post(`http://localhost:3002/api/v1/mail/send-mail`,mailData)
      // console.log(mailServiceCall)
      
  } catch (error:any) {
    console.log("Error in sendOtpService:", error.message);
    throw error;
  }
      

}