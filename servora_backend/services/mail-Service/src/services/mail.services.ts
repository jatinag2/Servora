import { log } from "node:console";
import { transporter } from "../config/mail.config";
import { Imail } from "../controller/mail.controller";


export const sendEmailService=async(data: Imail)=>{
     try {
        let info= await transporter.sendMail({
            from:data.from,
            to:data.email,
            html:data.body ,
            subject:data.subject,
         })
         console.log("after sendMail (sent successfully)");
         return info
     } catch (error: any) {
        console.log(error);
        
     }

} 