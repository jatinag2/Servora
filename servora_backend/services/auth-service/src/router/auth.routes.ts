
import express from "express";
import { forgotPasswordController, loginController, resetPasswordController, sendEmailController, signUpController, updatePasswordController, verfiyForgotPasswordOtpController,updateUserController } from "../controllers/auth.controller";
import { loginValidation } from "../middleware/auth.middleware";

const authRouter=express.Router()

// console.log('router')

 authRouter.post('/send-mail-auth',sendEmailController)
 authRouter.post('/signUp',signUpController)
 authRouter.post('/forgot-password',forgotPasswordController)
 authRouter.post('/login',loginController)
 authRouter.post('/forgot-password-verify-otp',verfiyForgotPasswordOtpController)
 authRouter.post('/reset-password',resetPasswordController)
 authRouter.post('/update-password',loginValidation, updatePasswordController)
 authRouter.put('/update-user-role/:role',updateUserController)
 export default authRouter