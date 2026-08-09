import mongoose from "mongoose";
export interface IUser {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: 'User' | 'Admin' | 'Worker';
    profileImage?: string;
    bio?: string;
    authUserId: string;
    skills?: string[];
    experience?: number;
    serviceCategory?: string[];
    isAvailable?: boolean;
    averageRating?: number;
    totalReviews?: number;
    totalJobsCompleted?: number;
    address?: string;
    isVerifiedWorker?: boolean;
    isBlocked?: boolean;
    lastActiveAt:string;
    profileImagePublicId:string,
    workerApplicationStatus:"Pending"| "Approved" |"Rejected",
    aadharCardNumber:String,
    panCardNumber:String,
    citizenShip:String,
    languageKnows:String[],
    age:Number
}


const userSchema = new mongoose.Schema<IUser>({
    authUserId: {
        type: String,
        required: [true, 'Auth user ID is required'],   
        unique: true,
    },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
    email: {
     type: String,
     required: [true, 'Email is required'],
     unique: true,
     trim: true,
    },
    phoneNumber: {
        type: String,
        
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['User', 'Admin','Worker'],
        default: 'User',
    },
    profileImage: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "",
        maxlength: 500,
    },
    skills: [String],
    experience:{
        type:Number,
        default:0
    },
    serviceCategory:[String],
    isAvailable:{
        type:Boolean,
        default:false
    },
    averageRating:{
        type:Number,
        default:0,
        min:0,
        max:5
    },
    totalReviews:{
        type:Number,
        default:0
    },
    totalJobsCompleted:{
        type:Number,
        default:0
    },
    address:{
        type:String,
        
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isVerifiedWorker:{
        type:Boolean,
        default:false
    },
    lastActiveAt:{
        type:String,
        default:""
    },
    profileImagePublicId:{
        type:String,
        default:""
    },
    workerApplicationStatus:{
        type:String,
        enum:["Pending","Approved","Rejected"],
        default:"Pending"
    },
    aadharCardNumber:{
        type:String
    },
    panCardNumber:{
        type:String
    },
    citizenShip:{
        type:String,
    },
    languageKnows:[String],
    age:{
        type:Number
    }
})

export const User=mongoose.model<IUser>("UserProfile",userSchema)