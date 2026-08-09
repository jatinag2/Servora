export type signUpPayload={
    fullName:string,
    password:string,
    confirmPassword:string,
    role:string,
    email:string,
    otp?:string
}
export type loginPayload={
    email:string,
    password:string
}
export type VerifyOtpForgotPasswordPayload={
   otp:string,
   email:string
}

export type ResetForgotPasswordPayload={
    password:string,
    confirmPassword:string,
    resetToken:string
}