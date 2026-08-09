
import dotenv from "dotenv"
dotenv.config();
import app from "./app"
import DBconnect from "./config/db.config";
import { rabbitMQConnection } from "./config/rabbitmq.config";
import {profileConsumer} from "../src/consumers/profileConsumer"

const port=process.env.PORT 

const startServer=async()=>{
     try {
        await rabbitMQConnection()
        await DBconnect()
        profileConsumer()
        app.listen(port,()=>{
         console.log(`user service is running on port ${port}`);
        })
        
    } catch (error) {
       console.log(error)
     process.exit(1);
    }
}

startServer()


