import { Express,NextFunction,Request,Response } from "express"
import { AppError } from "../utils/AppError"
import { sendOtpService } from "../services/otp.service"
import { apiResponse } from "../types/apiResponse"
import { signUpService,loginService ,updateUserService} from "../services/auth.service"
import cookieParser from "cookie-parser"
import { forgotPasswordService ,verifyForgotPasswordOtpService,resetPasswordService,updatePasswordService} from "../services/password.service"
import { getRedisClient } from "../config/redis.config"

export const sendEmailController=async(req: Request,res:Response)=>{
   console.log(req.body);
    const {fullName,email,password,confirmPassword}=req.body
    try {
        if(!fullName || !email || !password || !confirmPassword){
            throw new AppError("please provide all credentials ",400)
        }

        if(password.length<8){
            throw new AppError("at least 8 length password is required",422)
        }

         if(confirmPassword!=password){
           throw new AppError("confirm password and password are not equal",422)
        }
        console.log("Validation passed");
        //service call
       const newOtp= await sendOtpService({fullName,email,password});
console.log('hello')

       res.status(201).json({
        message:"otp mail send  successfully",
        success:true,
        data:newOtp
       } as apiResponse<typeof newOtp>
    )

    } catch (error :any) {
        res.status(error.statusCode || 400 ).json({
            success:false,
            message:error.message || "internal server error"
        })
    }    
}

export const signUpController=async(req:Request,res:Response)=>{
   
    try {
        const {fullName,email,password,otp}=req.body
        const userInfo=await signUpService({fullName,email,password,otp})

        res.cookie("refreshToken",userInfo.refreshToken,{
            httpOnly:true,
            // secure:false ,//true in production with HTTTPS
            // sameSite:"strict",
            maxAge:3*24*60*60*1000
        })
        res.status(201).json({
            message:"user registered successfully",
            success:true,
            data:userInfo.userObj
        } as apiResponse<typeof userInfo.userObj>)
    } catch (error:any) {
         res.status(error.statusCode || 400 ).json({
            success:false,
            message:error.message || "internal server error"
        })
    }
}


export const loginController=async(req:Request,res:Response)=>{
    try {
         const {email,password}=req.body

    if(!email || !password){
        throw new AppError("email and password required for login",400)

    }

    const client=getRedisClient()
    const clientIpAddress=req.ip

    const key=`${clientIpAddress}:req_count`

    const requestCount=await  client.incr(key)

    if(requestCount==1){
        await client.expire(key,60)
    }
    if(requestCount>10){
         throw new AppError("cannot hit more than 10req within 1 minute",400)
    }

    const logindata=await loginService({email,password});
     res.cookie("refreshToken",logindata.refreshToken,{
         httpOnly:true,
         maxAge:3*24*60*60*1000
     }).status(201).json({
            message:"user login successfully successfully",
            success:true,
            data:logindata.userObj
        } as apiResponse<typeof logindata.userObj>)
    } catch (error:any) {
         res.status(error.statusCode || 400 ).json({
            success:false,
            message:error.message || "internal server error"
        })
    }
   
}
export const forgotPasswordController =async(req:Request,res:Response)=>{

    try {

        const {email}=req.body
       if(!email){
        throw new AppError("email is required",400)
       }
       const forgotPasswordData=await forgotPasswordService({email})
       res.status(201).json({
        message:"otp send successfully forforgot password",
        success:true
       }as apiResponse<null>)
    } catch (error:any) {
        console.log(error)
        res.status(error.statusCode || 500).json({
            success:false,
            message:error.message || "internal server error"
        })
    }
    
}

export const verfiyForgotPasswordOtpController=async(req:Request,res:Response)=>{
    try {
       const {email,otp}=req.body
       if(!email || !otp){
          throw new AppError("email is required",400)
        }
        const updatedUserWithToken=await verifyForgotPasswordOtpService({email, otp})
        res.status(201).json({
            success:true,
            message:"otp verify successfully for forgot password",
            data:updatedUserWithToken
        } as apiResponse<typeof updatedUserWithToken>)
    } catch (error:any) {
        res.status(error.statusCode || 500).json({
            success:false,
            message:error.message || "internal server error"
        })
    }
    
}


export const resetPasswordController=async(req:Request,res:Response)=>{
    try {
        const {resetToken,password,confirmPassword}=req.body

        if( !password || !confirmPassword){
           throw new AppError("plese fiil all input ",400)
        }

        if(!resetToken){
          throw new AppError("wrong during fecthing token",400)
        }
        const resetPasswordDetail=await resetPasswordService({password,confirmPassword,resetToken})

        res.status(201).json({
            success:true,
            message:"password reset successfully"
        } as apiResponse<typeof resetPasswordDetail>)
    } catch (error:any) {
        console.log(error)
        res.status(error.statusCode || 500).json({
            success:false,
            message:error.message || "internal server error"
        })
    }
}

export const updatePasswordController=async(req:Request,res:Response)=>{
    try {
        const {userId,oldPassword,newPassword,confirmPassword}=req.body

    if(!userId || !oldPassword || !newPassword || !confirmPassword){
      throw new AppError("details are required",400)
    }
    if(newPassword!=confirmPassword){
      throw new AppError("confirm password not match with newpassword",400)
    }
    if(newPassword==oldPassword){
      throw new AppError("old password  matches with newpassword",400)
    }

    const updatePasswordDetail=await updatePasswordService({userId,oldPassword,newPassword});
    res.status(200).json({
            success:true,
            message:"password update successfully",
        } as apiResponse<typeof updatePasswordDetail>)
    } catch (error:any) {
         res.status(error.statusCode || 500).json({
            success:false,
            message:error.message || "internal server error"
        })
    }
   
}


export const updateUserController=async(req:Request,res:Response,next:NextFunction)=>{
try {
   const {role} =req.params 
   const {webRoleToken,UserId}=req.body;
   if(!role || !webRoleToken){
    throw new AppError("something went wrong",400)
   }
   if(webRoleToken!= process.env.WEB_ROLE_SECRET){
    throw new AppError("something went wrong",400)
   }
   const updateUserServiceCall=await updateUserService({role,UserId})
    res.status(201).json({
        message:"role change successfully",
        success:true,
        data:updateUserServiceCall
       } as apiResponse<typeof updateUserServiceCall>)
} catch (error) {
 next(error)   
}
}