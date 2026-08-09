import mongoose from "mongoose";

export interface iUser{
     fullName:string,
     email:string,
     password:string,
     role:string,
     resetToken:string,
     resetTokenExpiry:string
} 

const UserSchema=new mongoose.Schema <iUser>({
    fullName:{
     type:String,
     required:[true,"fullName field is missing"],
     trim:true
    },
    email:{
     type:String,
     unique:true,
     required:[true," email field is missing"],
     trim:true
    },
    password:{
     type:String,
     required:[true,"password field is missing"],
    },
    role:{
     type:String,
     enum:["User","Worker","Admin"]
    },
    resetToken:{
     type:String,
    },
    resetTokenExpiry:{
     type:String
    }
},{
     timestamps:true
})

export const User=mongoose.model<iUser>("User",UserSchema)  // dur to <iuser> all db operation became typesafe
