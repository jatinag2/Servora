import type { loginPayload, signUpPayload,ResetForgotPasswordPayload ,VerifyOtpForgotPasswordPayload} from "../../../types/auth";
import {registerUser, signUpMailApi,loginUser, OtpVerifyForgotPasswordApi, ResetForgotPasswordApi,ForgotPasswordApi} from '../../../api/auth'

export const signUpMailApiCall=async(data:signUpPayload)=>{
    const response=await signUpMailApi(data)

    if(!response?.data?.success){
        throw new Error("error occur during signup mail send api call")
    }
    return response;
}

export const signUpApiCall=async(data:signUpPayload)=>{
    const response=await registerUser(data)
    if(!response?.data?.success){
        throw new Error("error occur during signup mail send api call")
    }
    return response;
}

export const loginApiCall=async(data:loginPayload)=>{
    const response=await loginUser(data)
    if(!response?.data?.success){
        throw new Error("error occur during signup mail send api call")
    }
    return response;
}

export const forgotPasswordApiCall=async(data:string)=>{
    const response=await ForgotPasswordApi(data)
    if(!response?.data?.success){
        throw new Error("error occur during signup mail send api call")
    }
    return response;
}

export const otpVerifyForgotPasswordApiCall=async(data:VerifyOtpForgotPasswordPayload)=>{
    const response=await OtpVerifyForgotPasswordApi(data)
    if(!response?.data?.success){
        throw new Error("error occur during signup mail send api call")
    }
    return response;
}

export const resetForgotPasswordApiCall=async(data:ResetForgotPasswordPayload)=>{
    const response=await ResetForgotPasswordApi(data)
    if(!response?.data?.success){
        throw new Error("error occur during signup mail send api call")
    }
    return response;
}