
import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import { appError } from "../utils/appError.utils";



export const loginValidation=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")?  req.headers.authorization.split(" ")[1] : req.cookies.accessToken || req.body?.token 
    const tokenVerify= jwt.verify(token,process.env.SECREAT_KEY!)
    req.user=tokenVerify
    next();
  } catch (error:any) {
    res.status(error.statuCode || 400).json({
        success:false,
        message:error.message || "internal server error"
    })
  }
}