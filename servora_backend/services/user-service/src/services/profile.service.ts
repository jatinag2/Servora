import { User } from "../models/user.model"
import AppError from "../utils/appError";
import {fileUploadUtil,deleteFileUtil} from "../utils/cloudUpload"
import { UploadedFile } from 'express-fileupload';
import axios from "axios"
interface UserProfileData{
    authUserId:string,
    email:string,
    fullName:string,
    profileImage:string,
    role: 'User' | 'Admin' | 'Worker'
   
}
interface userProfileData{
   authUserId:string,
   fullName:string,
   bio:string,
   skills:string[],
   experience:number,
   serviceCategory:string[]
}
interface updateProfileImage{
     authUserId:string,
     profileImage:UploadedFile,
}

interface becomeWorker{
   authUserId:string,
   profileImage:UploadedFile,
   bio:string,
   skills:string[],
   experience:number,
   serviceCategory:string[],
   address:string,
   phoneNumber:string,
    aadharCardNumber:String,
    panCardNumber:String,
    citizenShip:String,
    languageKnows:String[],
    age:Number
}
interface addressUpdate{
   address:string,
   authUserId:string
}

export const createUserProfileService=async(data:UserProfileData)=>{
    const {authUserId,email,fullName,profileImage}=data;
     const isProfileExist=await User.findOne({authUserId:authUserId})
     if(isProfileExist){
        throw new AppError("user already exist",409)
     }

     const newUser= await User.create({
        authUserId:authUserId,
        email:email,
        profileImage:profileImage,
        fullName:fullName,
        role:"User",
        profileImagePublicId:""
     });
     console.log("profile ban gayi",newUser);
     

     return newUser
}


export const getUserProfileDetailService=async(userId:string)=>{
   const profileDetail=await User.find({authUserId:userId})
      if(profileDetail.length <1){
         throw new AppError("user not found ",404)
      }
      return profileDetail[0]
}

export const updateUserProfileDetailService=async(data:userProfileData)=>{
   const {authUserId,fullName,bio,skills,experience,serviceCategory}=data
   const getUserProfileDetail=await User.find({authUserId:authUserId})
      if(getUserProfileDetail.length <1){
         throw new AppError("profile not found ",404)
      }
     const updateProfileDetail=await User.findOneAndUpdate({authUserId:authUserId},{
      bio:bio,
      fullName:fullName,
      skills:skills,
      experience:experience,
      serviceCategory:serviceCategory
     },{new:true})
     return updateProfileDetail
}

export const updateProfileImageService=async(data:updateProfileImage)=>{
  const {profileImage,authUserId}=data
      const profileDetail=await User.find({authUserId:authUserId})
      if(!profileDetail){
         throw new AppError("profile not found ",404)
      }
      if(profileDetail[0].profileImagePublicId){
         await deleteFileUtil(profileDetail[0].profileImagePublicId)
      }
     const profileImageCloudinaryUrl=await fileUploadUtil(profileImage,process.env.CLOUDINARY_FOLDER_NAME!)
     const updatedProfile=await User.findOneAndUpdate({authUserId:authUserId},{
      profileImage:profileImageCloudinaryUrl?.secure_url,
      profileImagePublicId:profileImageCloudinaryUrl?.public_id
     },{new:true})
   return updatedProfile
}


export const removeProfileImageService=async(authUserId:string)=>{
     const profileDetail=await User.find({authUserId:authUserId})
      if(!profileDetail){
         throw new AppError("profile not found ",404)
      }
      if(profileDetail[0].profileImagePublicId){
         await deleteFileUtil(profileDetail[0].profileImagePublicId)
      }
      const updatedProfile=await User.findOneAndUpdate({authUserId:authUserId},{
      profileImage:null,
      profileImagePublicId:null
     },{new:true})
     return updatedProfile;
}

export const becomeWprkerService=async(data:becomeWorker)=>{
    const {authUserId,address,serviceCategory,experience,skills,bio,phoneNumber,profileImage,aadharCardNumber,panCardNumber,citizenShip,languageKnows,age}=data
     const profileDetail=await User.findOne({authUserId:authUserId})
      if(!profileDetail){
         throw new AppError("profile not found ",404)
      }
     if(profileDetail?.role=='Worker' && profileDetail?.workerApplicationStatus=="Pending"){
        throw new AppError("Your working application status is on pending ",400)
     }
      if(profileDetail?.role=='Worker' && profileDetail?.workerApplicationStatus=="Approved"){
        throw new AppError("You are already a worker",400)
     }
     if(profileDetail?.isBlocked){
        throw new AppError("Your are blocked by admin ,not elgible to become worker ",400)
     }
     const imageUrlInCloudinary=await fileUploadUtil(profileImage,process.env.CLOUDINARY_FOLDER_NAME!)
      const updatedProfile=await User.findOneAndUpdate({authUserId:authUserId},{
      role:"Worker",
      address:address,
      serviceCategory:serviceCategory,
      experience:experience,
      skills:skills,
      bio:bio,
      phoneNumber:phoneNumber,
      aadharCardNumber:aadharCardNumber,
      panCardNumber:panCardNumber,
      citizenShip:citizenShip,
      languageKnows:languageKnows,
      age:age,
      profileImage:imageUrlInCloudinary?.secure_url,
      profileImagePublicId:imageUrlInCloudinary?.public_id
     },{returnDocument:"after"})

      const updateAuthServiceUser=await axios.put("http://localhost:3000/api/v1/auth/update-user-role/Worker",{
             webRoleToken:process.env.WEB_ADMIN_SECRET,
             UserId:authUserId
         })
     return updatedProfile;
}

export const addressUpdateService=async(data:addressUpdate)=>{
   const{authUserId,address}=data
   const profileDetail=await User.findOne({authUserId:authUserId})
      if(!profileDetail){
         throw new AppError("profile not found ",404)
      }

      const updatedProfile= await User.findOneAndUpdate({authUserId:authUserId},{
         address:address
      },{returnDocument:"after"})
      return updatedProfile
}