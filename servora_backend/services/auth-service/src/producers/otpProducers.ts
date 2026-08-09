import { buffer, json } from "node:stream/consumers"
import { getRabbitMQChannel, mail_exchange } from "../config/rabbitMQ.config"



export const sendOtpMessage=(data:any)=>{
   const channel=getRabbitMQChannel()
   channel.publish(mail_exchange,"mail_routing_key",Buffer.from(JSON.stringify(data)))
}

