import {api} from "../api/axios"
import type { signUpPayload ,loginPayload, ResetForgotPasswordPayload, VerifyOtpForgotPasswordPayload} from "../types/auth"

export const signUpMailApi=(data:signUpPayload)=>{
    return api.post("/auth/send-mail-auth",data)
}

export const registerUser=(data:signUpPayload)=>{
    return api.post('/auth/signUp',data)
}

export const loginUser=(data:loginPayload)=>{
    return api.post('/auth/login',data)
}

export const ForgotPasswordApi=(email:string)=>{
    return api.post('/auth/forgot-password',{email})
}

export const OtpVerifyForgotPasswordApi=(data:VerifyOtpForgotPasswordPayload)=>{
    return api.post('/auth/forgot-password-verify-otp',data)
}

export const ResetForgotPasswordApi=(data:ResetForgotPasswordPayload)=>{
    return api.post('/auth/reset-password',data)
}