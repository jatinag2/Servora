import dotenv from "dotenv"
dotenv.config();
console.log('hello')
import app from "./app"
import { rabbitMQConnection } from "./config/rabbitMQ.config";
import { mailOtpConsumer } from "./consumers/otpConsumers";
const port =process.env.PORT
const startServer=async()=>{
   await  rabbitMQConnection()
   await  mailOtpConsumer()
    app.listen(port,()=>{
    console.log("mail service is running on port",port)
})
}

startServer()
