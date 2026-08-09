import { NextFunction ,Request,Response} from "express";

export const errorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    res.status(err.stausCode || 500).json({
        success:false,
        message:err.message || 'Internal server error'
    })
}