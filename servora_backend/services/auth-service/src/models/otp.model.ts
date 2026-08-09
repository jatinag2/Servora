import mongoose from "mongoose"

interface iOtp{
   otp:string,
   email:string,
   createdAt:Date
}

const otpSchema= new mongoose.Schema<iOtp>({
    otp:{
        type:String,
        required:[true,"otp is required"]
    },
    email:{
        type:String,
        trim:true,
        required:[true,"user email is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    }

})

 const Otp= mongoose.model<iOtp>('Otp',otpSchema)
 export default Otp