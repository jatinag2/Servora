
import dotenv from "dotenv"
dotenv.config();
import app from "./app"
import DBconnect from "./config/db.config";
import { redisConnect } from "./config/redis.config";
import { rabbitMQConnection } from "./config/rabbitMQ.config";

const port=process.env.PORT 

const startServer=async()=>{
     try {
        await DBconnect()
        
        await redisConnect()
        await rabbitMQConnection()
        app.listen(port,()=>{
         console.log(`auth service is running on port ${port}`);
        })
        
    } catch (error) {
       console.log(error)
     process.exit(1);
    }
}

startServer()


