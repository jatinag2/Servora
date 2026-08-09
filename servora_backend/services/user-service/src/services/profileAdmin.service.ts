import { User } from "../models/user.model"
import AppError from "../utils/appError";
import axios from "axios"

interface iApprovedWorker{
    authUserId:string,
    adminAuthUserId:string,

}
export const getAllWorkersForVerificationService= async(authUserId:string)=>{
      const profileDetail=await User.findOne({authUserId:authUserId})
           if(!profileDetail){
              throw new AppError("profile not found ",404)
           }
     if(profileDetail.role!=="Admin"){
          throw new AppError("unauthorized user",403)
     }
  
  const allworker=await User.find({role:"Worker",workerApplicationStatus:"Pending"})
  return allworker
} 

export const becomeAdminService=async(authUserId:string)=>{
    const profileDetail=await User.findOne({authUserId:authUserId})
           if(!profileDetail){
              throw new AppError("profile not found ",404)
        }
    console.log("haa service par hu");
    
    const updadatedUser=await User.findOneAndUpdate({authUserId:authUserId},{
        role:"Admin"
    },{returnDocument:"after"})
console.log("user admin bana diya");

    const updateAuthServiceUser=await axios.put("http://localhost:3000/api/v1/auth/update-user-role/Admin",{
        webRoleToken:process.env.WEB_ADMIN_SECRET,
        UserId:authUserId
    })
    console.log("userdatabse me bhi cchange kar diya");
    
   return updadatedUser
}

export const getWorkerDetailService=async(authUserId:string)=>{
      const profileDetail=await User.findOne({authUserId:authUserId})
           if(!profileDetail){
              throw new AppError("profile not found ",404)
        }
        return profileDetail
}

export const approvedForWorkerService =async(data:iApprovedWorker)=>{
    const{authUserId,adminAuthUserId}=data
     const adminProfileDetail=await User.findOne({authUserId:adminAuthUserId})
           if(!adminProfileDetail){
              throw new AppError("Admin profile not found",404)
           }
     if(adminProfileDetail.role!=="Admin"){
          throw new AppError("unauthorized user",403)
     }
    const profileDetail=await User.findOne({authUserId:authUserId})
           if(!profileDetail){
              throw new AppError("profile not found ",404)
        }
if(profileDetail.workerApplicationStatus==="Approved"){
    throw new AppError("user already approved for worker",404)
}
        const updateUser=await User.findOneAndUpdate({authUserId:authUserId},{
            workerApplicationStatus:"Approved",
            role:"Worker"
        },{returnDocument:"after"})
        const role="Worker"
        const updateAuthServiceUser=await axios.put(`http://localhost:3000/api/v1/auth/update-user-role/${role}`,{
        webRoleToken:process.env.WEB_ADMIN_SECRET,
        UserId:authUserId
    })
        return updateUser
}
export const rejectForWorkerService =async(data:iApprovedWorker)=>{

      const{authUserId,adminAuthUserId}=data
     const adminProfileDetail=await User.findOne({authUserId:adminAuthUserId})
           if(!adminProfileDetail){
              throw new AppError("Admin profile not found",404)
           }
     if(adminProfileDetail.role!=="Admin"){
          throw new AppError("unauthorized user",403)
     }
    const profileDetail=await User.findOne({authUserId:authUserId})
           if(!profileDetail){
              throw new AppError("profile not found ",404)
        }
if(profileDetail.workerApplicationStatus==="Rejected"){
    throw new AppError("user already rehected for worker",404)
}
        const updateUser=await User.findOneAndUpdate({authUserId:authUserId},{
            workerApplicationStatus:"Rejected",
            role:"User"
        },{returnDocument:"after"})
        const role="User"
         const updateAuthServiceUser=await axios.put(`http://localhost:3000/api/v1/auth/update-user-role/${role}`,{
        webRoleToken:process.env.WEB_ADMIN_SECRET,
        UserId:authUserId
    })
        return updateUser
}