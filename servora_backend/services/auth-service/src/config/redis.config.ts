import { createClient } from 'redis';
import { AppError } from '../utils/AppError';
import { log } from 'node:console';


let client :any = null
export const redisConnect=async()=>{
    
    try {
        client=createClient({
          url:process.env.REDIS_URL
        })
       await client.connect();
       console.log("redis connect successfully")  
    } catch (error) {
         console.log(error);
         
    }
}

export const getRedisClient=()=>{
    if(!client){
        throw new AppError(" No redis client available",400)
    }
    return client
}


