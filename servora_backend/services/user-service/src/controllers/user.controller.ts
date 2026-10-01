import AppError from "../utils/appError"
import { NextFunction, Request,Response } from "express"
import {createUserProfileService,getUserProfileDetailService,updateUserProfileDetailService,updateProfileImageService,removeProfileImageService,becomeWprkerService,addressUpdateService} from "../services/profile.service"
import { ApiResponse } from "../utils/appResponse"
import { UploadedFile } from 'express-fileupload';
import {getAllWorkersForVerificationService,becomeAdminService,getWorkerDetailService,approvedForWorkerService,rejectForWorkerService} from '../services/profileAdmin.service'

export const createUserProfile=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const{authUserId,fullName,email,profileImage,role}=req.body
        if(!authUserId || !fullName || !email || !profileImage || !role ){
            throw new AppError("something went wrong",404)
        }
       
        const createUserProfileServiceCall=await createUserProfileService({authUserId,fullName,email,profileImage,role})

        res.status(201).json({
            success:true,
            message:"user profile created successfully",
            data:createUserProfileServiceCall
        })
    } catch (error:any) {
        console.log(error);
       next(error)
        
    }
}

export const getUserProfileDetailController=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        //fetch userID
        const userDetails=JSON.parse(req.headers['user_id'] as string)
        const userId=userDetails.userId
        console.log(userDetails);
        console.log(userId);
         if(!userId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
        const getUserProfileDetailServiceCall=await getUserProfileDetailService(userId)
       
        res.status(200).json({
            success:true,
            message:"succesfully get user details",
            data:getUserProfileDetailServiceCall
        }as ApiResponse<typeof getUserProfileDetailServiceCall>)
    } catch (error:any) {
        console.log(error);
        next(error)
    }
}

export const updateProfileDetailController=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {
    const {fullName,bio,skills=[],experience,serviceCategory}=req.body
    const userDetails=JSON.parse(req.headers['user_id'] as string)
     const authUserId=userDetails.userId
    if(!fullName ){
        throw new AppError("please give your full name",400)
    }
    const updateUserProfileDetailServiceCall=await updateUserProfileDetailService({fullName,bio,skills,experience,serviceCategory,authUserId})
    res.status(200).json({
            success:true,
            message:"succesfully get user details",
            data:updateUserProfileDetailServiceCall
        }as ApiResponse<typeof updateUserProfileDetailServiceCall>)
  } catch (error:any) {
     next(error)
  }

}

export const uploadProfileImageController=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
         if (!req.files || !req.files.profileImage) {
            throw new AppError("No file uploaded",400)
        }
        const profileImage=req.files.profileImage  as UploadedFile
       const userDetails=JSON.parse(req.headers['user_id'] as string)
       const authUserId=userDetails.userId
         if(!authUserId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
          if(!profileImage){
            throw new AppError("please select profile picture",500)
        }

        const updateProfileImageServiceCall=await updateProfileImageService({profileImage,authUserId})
         res.status(200).json({
            success:true,
            message:"succesfully update user profile image",
            data:updateProfileImageServiceCall
        }as ApiResponse<typeof updateProfileImageServiceCall>)
    } catch (error:any) {
          next(error)
    }
}
 
export const removeProfileImageController=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
       const userDetails=JSON.parse(req.headers['user_id'] as string)
       const authUserId=userDetails.userId
         if(!authUserId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
        const removeProfileImageServiceCall=await removeProfileImageService(authUserId)
         res.status(200).json({
            success:true,
            message:"succesfully remove user profile image",
            data:removeProfileImageServiceCall
        }as ApiResponse<typeof removeProfileImageServiceCall>)
    } catch (error) {
          next(error)
    }
}

export const becomeWorkerController=async(req:Request,res:Response,next:NextFunction)=>{
   try {
       const userDetails=JSON.parse(req.headers['user_id'] as string)
       const authUserId=userDetails.userId
        if(!authUserId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
      }
    const {address,serviceCategory,experience,skills,bio,phoneNumber, aadharCardNumber,panCardNumber,citizenShip,languageKnows,age}=req.body
    const profileImage=req.files?.profileImage as UploadedFile

    if(!authUserId || !address || !serviceCategory || !experience || !skills || !bio || !phoneNumber || !profileImage|| !aadharCardNumber|| !panCardNumber || !citizenShip || !languageKnows || !age){
          throw new AppError("please provide all input field",500)
    }
    const  becomeWprkerServiceCall=await becomeWprkerService({authUserId,address,serviceCategory,experience,skills,bio,phoneNumber, aadharCardNumber,panCardNumber,citizenShip,languageKnows,age,profileImage})
    res.status(200).json({
            success:true,
            message:"succesfully applied for worker role",
        }as ApiResponse<null>)
   } catch (error) {
        next(error)
   }
}

export const addressUpdateController=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const userDetails=JSON.parse(req.headers['user_id'] as string)
        const authUserId=userDetails.userId
        if(!authUserId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
        const {address}=req.body;
        if(!address){
            throw new AppError("provide your adddress",404)
        }
        const addressUpdateServiceCall =await addressUpdateService({authUserId,address})
         res.status(200).json({
            success:true,
            message:"address updated successfully",
            data:addressUpdateServiceCall
        }as ApiResponse<typeof addressUpdateServiceCall>)
    } catch (error) {
        next(error)
    }
}

export const getAllWorkersForVerification=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const userDetails=JSON.parse(req.headers['user_id'] as string)
        const authUserId=userDetails.userId
        if(!authUserId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
        const getAllWorkersForVerificationServiceCall=await getAllWorkersForVerificationService(authUserId)
         res.status(200).json({
            success:true,
            message:"successfully fetched all workers",
            data:getAllWorkersForVerificationServiceCall
        }as ApiResponse<typeof getAllWorkersForVerificationServiceCall>)
    } catch (error) {
        next(error)
    }
}

export const becomeAdminController=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {webSecret}=req.body
        const userDetails=JSON.parse(req.headers['user_id'] as string)
        const authUserId=userDetails.userId
        if(!authUserId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
        if(!webSecret){
            throw new AppError("unauthorized user",500)
        }
        if(webSecret!=process.env.WEB_ADMIN_SECRET){
              throw new AppError("wrong secret",500)
        }
        const becomeAdminServiceCall=await becomeAdminService(authUserId)
        
          res.status(200).json({
            success:true,
            message:"you become admin now",
            data:becomeAdminServiceCall
        }as ApiResponse<typeof becomeAdminServiceCall>)
    } catch (error) {
        next(error)
    }
}



export const getWorkerDetailController=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {authUserId}=req.params
        if(!authUserId){
           throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
        const getWorkerDetailServiceCall=await getWorkerDetailService(authUserId as string)
         res.status(200).json({
            success:true,
            message:"your details",
            data:getWorkerDetailServiceCall
        }as ApiResponse<typeof getWorkerDetailServiceCall>)
    } catch (error) {
        next(error)
    }
}

export const approvedForWorkerController=async(req:Request,res:Response,next:NextFunction)=>{
   try {
    const {authUserId }=req.params 
    const {webSecretAdmin}=req.body
    const userDetails =JSON.parse(req.headers['user_id'] as string)
    const adminAuthUserId : string =userDetails.userId
        if(!webSecretAdmin){
            throw new AppError("unauthorized user",500)
        }
        if(webSecretAdmin!=process.env.WEB_ADMIN_SECRET){
              throw new AppError("wrong secret",500)
        }
        if(!adminAuthUserId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
      if(!authUserId){
           throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
      }
        const approvedForWorkerServiceCall=await approvedForWorkerService({authUserId:authUserId as string, adminAuthUserId:adminAuthUserId as string })
       res.status(200).json({
            success:true,
            message:"approved for worker",
            data:approvedForWorkerServiceCall
        }as ApiResponse<typeof approvedForWorkerServiceCall>)
   } catch (error) {
    next(error)
   }
}


export const rejectForWorkerController=async(req:Request,res:Response,next:NextFunction)=>{
   try {
    const {authUserId}=req.params 
    const userDetails =JSON.parse(req.headers['user_id'] as string)
      const adminAuthUserId : string =userDetails.userId
       const {webSecretAdmin}=req.body
         if(!webSecretAdmin){
            throw new AppError("unauthorized user",500)
        }
        if(webSecretAdmin!=process.env.WEB_ADMIN_SECRET){
              throw new AppError("wrong secret",500)
        }
        if(!adminAuthUserId){
            throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
        }
      if(!authUserId){
           throw new AppError("SOMETHING WENT WRONG DURING fetching user details",500)
      }
        const rejectForWorkerServiceCall=await rejectForWorkerService({authUserId:authUserId as string, adminAuthUserId:adminAuthUserId as string })
         res.status(200).json({
            success:true,
            message:"rejct for worker",
            data:rejectForWorkerServiceCall
        }as ApiResponse<typeof rejectForWorkerServiceCall>)
   } catch (error) {
    next(error)
   }
}
