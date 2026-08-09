import express from "express"
import { mailRouter } from "./router/mail.router";
const app= express();
app.use(express.json())
// console.log('mailapp')
app.use('/api/v1/mail',mailRouter)
export default app;