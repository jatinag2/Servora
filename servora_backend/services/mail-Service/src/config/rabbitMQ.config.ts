import amqplib, { Channel } from "amqplib"
import { log } from "node:console"

let channel:Channel;
 const mail_exchange="mail_exchange"
 const mail_routing_key="mail_routing_key"

export const mail_queue="mail_queue" 
 
export const rabbitMQConnection=async()=>{
  
    try {
        const connection = await amqplib.connect("amqp://localhost:5672")
        channel=await connection.createChannel()
    await channel.assertExchange(mail_exchange,"direct",{durable:false})
    await channel.assertQueue(mail_queue,{durable:false})
    await channel.bindQueue(mail_queue,mail_exchange,mail_routing_key)
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