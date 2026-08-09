import { Router } from "express";
import { sendMail } from "../controller/mail.controller";


export const mailRouter=Router()
console.log('mailrouter')
mailRouter.post('/send-mail',sendMail)