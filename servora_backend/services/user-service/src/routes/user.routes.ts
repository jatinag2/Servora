
import express from "express";
import { createUserProfile,getUserProfileDetailController,updateProfileDetailController ,uploadProfileImageController,becomeWorkerController,addressUpdateController,getAllWorkersForVerification,becomeAdminController,getWorkerDetailController,approvedForWorkerController,rejectForWorkerController} from "../controllers/user.controller";


const userRouter=express.Router()

// console.log('router')
userRouter.post('/create-profile',createUserProfile)
userRouter.get('/get-profile-details',getUserProfileDetailController)
userRouter.put('/update-profile-details',updateProfileDetailController)
userRouter.put('/update-profile-picture',uploadProfileImageController)
userRouter.post('/become-worker',becomeWorkerController)
userRouter.post('/update-address',addressUpdateController)
userRouter.put('/become-admin',becomeAdminController)
userRouter.get('/all-workers-for-verfication',getAllWorkersForVerification)
userRouter.get('/get-worker-details/:authUserId',getWorkerDetailController)
userRouter.put('/approved-for-worker/:authUserId',approvedForWorkerController)
userRouter.put('/reject-for-worker/:authUserId',rejectForWorkerController)
 export default userRouter