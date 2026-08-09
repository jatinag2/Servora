import { Request,Response } from "express"
import { AppError } from "../utils/appError"
import { apiResponse } from "../types/apiResponse"
import { sendEmailService } from "../services/mail.services"

export interface Imail{
  email:string,
  subject:string,
  body:string,
  from:string
}

export const sendMail=async(req:Request<{},{},Imail>,res:Response)=>{
    console.log(req.body)
    try {
         const {email,subject,body,from}=req.body
console.log(email)
    if(!email || !subject || !body || !from){
        throw new AppError(`data is incomplete for mail transfer`,400)
    }
    const sendMail=await sendEmailService({email,subject,body,from})
    console.log('mail controller')
    res.status(200).json({
        success:true,
        message:"otp send successfully"
    } as apiResponse<null>)
    } catch (error:any) {
        console.log(error)
        res.status(error.statusCode || 500).json({
            success:false,
           message:error.message || "Internal server error"
        })
    }
   
}