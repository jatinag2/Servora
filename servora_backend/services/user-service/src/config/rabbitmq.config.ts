import amqp,{Channel} from "amqplib"
import AppError from "../utils/appError"



const profile_exchange_name="profile_exchange"
export const profile_queue_name="profile_queue"
const profile_routing_key="profile_routing_key"
let channel:Channel
export const rabbitMQConnection=async()=>{
     try {
        const connection=await amqp.connect("amqp://localhost:5672")
         channel=await connection.createChannel()
       
        await channel.assertExchange(profile_exchange_name,"direct",{durable:false})
        await channel.assertQueue(profile_queue_name,{durable:false})
        await channel.bindQueue(profile_queue_name,profile_exchange_name,profile_routing_key)
        console.log("user service rabbit mq created successfully");
        
     } catch (error) {
        console.log(error);
        throw new AppError("error on creating rabbit mq channel",404)
     }
}

export const getRabbitMQChannel=()=>{
    if(!channel){
         throw new AppError("error occur during getting channel",404)
    }
    return channel
}