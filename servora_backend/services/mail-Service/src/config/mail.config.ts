import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
   
    host:process.env.HOST_GMAIL,
    port:Number(process.env.HOST_PORT),
    secure:true,
    auth:{
        user:process.env.USER_GMAIL,
        pass:process.env.PASS
    }

})