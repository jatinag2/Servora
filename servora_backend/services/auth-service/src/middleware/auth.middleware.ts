
import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import { AppError } from "../utils/AppError";



export const loginValidation=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const token = req.headers.authorization;
    if(!token || !token.startsWith("Bearer ")){
        throw new AppError("token is missing",400)
    }

    const actualToken=token.split(" ")[1]
    const secret = process.env.SECREAT_KEY;

    if (!secret) {
      throw new AppError("secret key missing", 500);
    }
    console.log("SIGN SECRET:", secret);
    const tokenVerify= jwt.verify(actualToken,secret)
    req.user=tokenVerify
    next();
  } catch (error:any) {
    res.status(error.statusCode || 400).json({
        success:false,
        message:error.message || "internal server error"
    })
  }
}