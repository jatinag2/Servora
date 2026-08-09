import v2 from "../config/cloudinary.config"
import {UploadApiOptions} from "cloudinary"

export const fileUploadUtil=async(file:any,folder:string,height:any=undefined,width:any=undefined)=>{
 try {
     const options:UploadApiOptions={
    resource_type:"auto",
    folder:folder
  }
  if(height){
    options.height=height;
  }
  if(width){
    options.width=width
  }
  return await v2.uploader.upload(file.tempFilePath,options)
 } catch (error) {
     console.log("error on uplading cloudinary files");
     
 }
}

export const deleteFileUtil=async(publicId:string)=>{
  try {
    const result=await v2.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.log("error on deleting image from cloudinary");
    
  }
}