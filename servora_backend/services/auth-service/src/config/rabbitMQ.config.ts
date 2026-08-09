import amqplib, { Channel } from "amqplib"
import { log } from "node:console"

let channel:Channel;
export const mail_exchange="mail_exchange"
export const profile_exchange="profile_exchange"
export const rabbitMQConnection=async()=>{
   
    try {
        const connection = await amqplib.connect("amqp://localhost:5672")
        channel=await connection.createChannel()
        
    await channel.assertExchange(mail_exchange,"direct",{durable:false})
    await channel.assertExchange(profile_exchange,"direct",{durable:false})
    console.log("auth service rabbitmq connection estblished successfully");
    } catch (error) {
        console.log(error);
        
    }
}

export const getRabbitMQChannel=()=>{
    if(!channel){
        throw new Error("error occur during getting channel")
    }
    return channel
}